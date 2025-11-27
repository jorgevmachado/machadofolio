import React from 'react';
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import FileInput from './File';

jest.mock('../../../../../assets/base64', () =>({
    XLSX_IMAGE_BASE64: 'base64-image-xlsx',
    DOC_IMAGE_BASE64: 'base64-image-doc',
    PDF_IMAGE_BASE64: 'base64-image-pdf'
}));

const mockFileToBase64 = jest.fn();
const mockImageTypeValidator = jest.fn();
const mockUrlToBase64 = jest.fn();
const mockExtractExtensionFromBase64 = jest.fn();

jest.mock('@repo/services', () => ({
    fileToBase64: (...params: any[]) => mockFileToBase64(...params),
    imageTypeValidator: (...params: any[]) => mockImageTypeValidator(...params),
    urlToBase64: (...params: any[]) => mockUrlToBase64(...params),
    extractExtensionFromBase64: (...params: any[]) => mockExtractExtensionFromBase64(...params),
}));

jest.mock('../../../../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('../../../../../elements', () => ({
    Image: ({ src }: { src: string }) => (<img src={src} alt="Preview" data-testid="mock-image"/>),
    Icon: (props: any) => (<span data-testid="mock-icon" {...props} />)
}));
jest.mock('../../../../button', () => ({
    __esModule: true,
    default: (props: any) => (<button {...props} data-testid="mock-button"/>),
}));

function createFile(name: string, type = 'application/pdf') {
    const file = new File(['dummy content'], name, { type });
    Object.defineProperty(file, 'webkitRelativePath', { value: '', configurable: true });
    return file;

}

describe('<File/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    const defaultProps = {
        accept: 'image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        context: 'neutral',
        onChange: jest.fn(),
        disabled: false,
        isInvalid: false,
    };

    const renderComponent = (props: any = {}) => {
        return render (<FileInput {...defaultProps} {...props}/>);
    }

    it('Should render component with default props', () => {
        renderComponent();
        const component = screen.getByTestId('ds-file-input')
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-file-input');
        expect(screen.getByText('No file selected')).toBeInTheDocument();
    });

    it('Should render component with multiple', () => {
        renderComponent({ multiple: true });
        expect(screen.getByText('No files selected')).toBeInTheDocument();
    });

    it('Should apply custom id and extra classes', () => {
        renderComponent({ id: 'my-id', className: 'custom-class', placeholder: 'INPUT' });
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(document.getElementById('my-id')).toBeInTheDocument();
    });

    it('Should correctly apply "disabled" attribute', () => {
        renderComponent({ disabled: true });
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Should correctly apply visual context', () => {
        renderComponent({ context: 'error' });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Should accept the "accept" prop and pass it to <input>', () => {
        renderComponent({ accept: '.png,.pdf' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.accept).toBe('.png,.pdf');
    });

    it('Should call onChange with file in base64 and handle image (with preview)', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockResolvedValueOnce('base64-image');
        renderComponent({ withPreview: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');
        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });
        await waitFor(() => {
            expect(screen.getByTestId('mock-image')).toBeInTheDocument();
        });
        expect(screen.getByText('teste.png')).toBeInTheDocument();
    });

    it('Should call onChange with error', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockRejectedValueOnce('base64-image');
        const mockOnChange = jest.fn();
        const mockOnInput = jest.fn();
        renderComponent({ onChange: mockOnChange, onInput: mockOnInput, withPreview: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: true,
                    files: [{ error: true, fileName: 'teste.png', preview: '', value: '' }],
                    filesName: [{ error: true, value: 'teste.png' }],
                    name: 'file',
                    preview: '',
                    value: ''
                })
            );
            expect(mockOnInput).toHaveBeenCalledWith(expect.any(Object), '');
        });
    });

    it('Should call onChange with PDF file and show PDF preview', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: false });
        mockFileToBase64.mockResolvedValueOnce('base64-file');
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.pdf', 'application/pdf');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                files: [{ error: false, fileName: 'my-file.pdf', preview: 'base64-image-pdf', value: 'base64-file' }],
                filesName: [{ error: false, value: 'my-file.pdf' }],
                name: 'file',
                preview: 'base64-image-pdf',
                value: 'base64-file'
            }));
        });
        expect(screen.getByText('my-file.pdf')).toBeInTheDocument();
    });

    it('Should call onChange with .xlsx file and show XLSX preview', async () => {
        const mockOnChange = jest.fn();
        mockImageTypeValidator.mockReturnValueOnce({ valid: false });
        mockFileToBase64.mockResolvedValueOnce('xlsx-file-base64');
        renderComponent({ onChange: mockOnChange, withPreview: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                files: [{ error: false, fileName: 'my-file.xlsx', preview: 'base64-image-xlsx', value: 'xlsx-file-base64' }],
                filesName: [{ error: false, value: 'my-file.xlsx' }],
                name: 'file',
                preview: 'base64-image-xlsx',
                value: 'xlsx-file-base64'
            }));
        });
        expect(screen.getByText('my-file.xlsx')).toBeInTheDocument();
    });

    it('Should call onChange with doc file for unknown extensions', async () => {
        const mockOnChange = jest.fn();
        mockImageTypeValidator.mockReturnValueOnce({ valid: false });
        mockFileToBase64.mockResolvedValueOnce('default-file-base64');
        renderComponent({ onChange: mockOnChange, withPreview: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                files: [{ error: false, fileName: 'my-file.docx', preview: 'base64-image-doc', value: 'default-file-base64' }],
                filesName: [{ error: false, value: 'my-file.docx' }],
                name: 'file',
                preview: 'base64-image-doc',
                value: 'default-file-base64'
            }));
        });
        expect(screen.getByText('my-file.docx')).toBeInTheDocument();
    });

    it('Should properly handle input with no selected file', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: null } });
        expect(screen.getByText('No file selected')).toBeInTheDocument();
        await waitFor(() => expect(mockOnChange).not.toHaveBeenCalled());
    });

    it('Should trigger input click when button is clicked', () => {
        renderComponent();
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        jest.spyOn(input, 'click');
        fireEvent.click(screen.getByRole('button'));
        expect(input.click).toHaveBeenCalled();
    });

    it('Should not render preview if withPreview is false, even with file', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockResolvedValueOnce('base64-image');
        renderComponent();
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('img.png', 'image/png');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
        });
    });

    it('Should pass extra props to the input', () => {
        renderComponent({ 'data-testid': 'input-file', title: 'my-input' });
        expect(screen.getByTitle('my-input')).toBeInTheDocument();
        expect(screen.getByTestId('input-file')).toBeInTheDocument();
    });

    it('Should preview file when received by value', async () => {
        mockUrlToBase64.mockResolvedValueOnce('default-preview-img');
        mockExtractExtensionFromBase64.mockReturnValueOnce('png');
        renderComponent({ value: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s', withPreview: true });
        await waitFor(() => {
            expect(mockUrlToBase64).toHaveBeenCalledWith('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s');
            expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'default-preview-img');
        });
    });

    it('Should remove file when remove button is clicked', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockResolvedValueOnce('base64-image');
        const mockOnChange = jest.fn();
        const mockOnInput = jest.fn();
        renderComponent({ onChange: mockOnChange, onInput: mockOnInput, withPreview: true, showRemoveButton: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: false,
                    files: [{ error: false, fileName: 'teste.png', preview: 'base64-image', value: 'base64-image' }],
                    filesName: [{ error: false, value: 'teste.png' }],
                    name: 'file',
                    preview: 'base64-image',
                    value: 'base64-image'
                })
            );
            expect(mockOnInput).toHaveBeenCalledWith(expect.any(Object), 'base64-image');
        });
        await waitFor(() => {
            expect(screen.getByTestId('ds-file-input-remove')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('ds-file-input-remove'));
        await waitFor(() => {
            expect(screen.queryByText('teste.png')).not.toBeInTheDocument();
            expect(screen.getByText('No file selected')).toBeInTheDocument();
        });
    });

    it('Should handle clearFile prop and remove file', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockResolvedValueOnce('base64-image');
        const mockOnChange = jest.fn();
        const { rerender } = renderComponent({ onChange: mockOnChange, withPreview: true, showRemoveButton: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(screen.getByText('teste.png')).toBeInTheDocument();
        });
        rerender(<FileInput {...defaultProps} context="primary" onChange={mockOnChange} withPreview={true} showRemoveButton={true} clearFile={true} />);
        await waitFor(() => {
            expect(screen.getByText('No file selected')).toBeInTheDocument();
        });
    });

    it('Should handle multiple files selection', async () => {
        mockImageTypeValidator.mockReturnValue({ valid: true });
        mockFileToBase64.mockResolvedValue('base64-image');
        renderComponent({ multiple: true, withPreview: true });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file1 = createFile('file1.png', 'image/png');
        const file2 = createFile('file2.png', 'image/png');
        fireEvent.change(input, { target: { files: [file1, file2] } });
        await waitFor(() => {
            expect(screen.getByText('file1.png')).toBeInTheDocument();
            expect(screen.getByText('file2.png')).toBeInTheDocument();
        });
    });

    it('Should not update state or call onChange if targetFile is null', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [undefined] } });

        await waitFor(() => {
            expect(mockOnChange).not.toHaveBeenCalled();
            expect(screen.getByText('No file selected')).toBeInTheDocument();
        });
    });

    it('Should call onRemove callback when remove button is clicked', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockResolvedValueOnce('base64-image');
        const mockOnRemove = jest.fn();
        renderComponent({ withPreview: true, showRemoveButton: true, onRemove: mockOnRemove });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(screen.getByTestId('ds-file-input-remove')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByTestId('ds-file-input-remove'));
        await waitFor(() => {
            expect(mockOnRemove).toHaveBeenCalled();
            expect(screen.getByText('No file selected')).toBeInTheDocument();
        });
    });
});