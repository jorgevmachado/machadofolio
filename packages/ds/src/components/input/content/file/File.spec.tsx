import React from 'react';

import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import FileInput from './File';

jest.mock('../../../../assets/doc.png', () => 'mock-doc.png');
jest.mock('../../../../assets/pdf.png', () => 'mock-pdf.png');
jest.mock('../../../../assets/xlsx.png', () => 'mock-xlsx.png');

const mockFileToBase64 = jest.fn();
const mockImageTypeValidator = jest.fn();
const mockUrlToBase64 = jest.fn();

jest.mock('@repo/services', () => ({
    fileToBase64: (...params: any[]) => mockFileToBase64(...params),
    imageTypeValidator: (...params: any[]) => mockImageTypeValidator(...params),
    urlToBase64: (...params: any[]) => mockUrlToBase64(...params),
}));

jest.mock('../../../../utils', () => ({
    joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('../../../../elements', () => ({
    Image: ({ src }: { src: string }) => (<img src={src} alt="Preview" data-testid="mock-image"/>)
}));
jest.mock('../../../../components', () => ({
    Button: (props: any) => (<button {...props} data-testid="mock-button"/>),
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
    });

    it('should apply custom id and extra classes', () => {
        renderComponent({ id: 'my-id', className: 'custom-class', placeholder: 'INPUT' });
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(document.getElementById('my-id')).toBeInTheDocument();
    });

    it('should correctly apply "disabled" attribute', () => {
        renderComponent({ disabled: true });
        expect(screen.getByRole('button')).toBeDisabled();
        fireEvent.click(screen.getByRole('button'));
    });

    it('should correctly apply visual context', () => {
        renderComponent({ context: 'error' });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should accept the "accept" prop and pass it to <input>', () => {
        renderComponent({ accept: '.png,.pdf' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.accept).toBe('.png,.pdf');
    });

    it('should call onChange with file in base64 and handle image (with preview)', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: true });
        mockFileToBase64.mockResolvedValueOnce('base64-image');

        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'base64-image')
        });

        expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });

    it('should call onChange with PDF file and show PDF preview', async () => {
        mockImageTypeValidator.mockReturnValueOnce({ valid: false });
        mockFileToBase64.mockResolvedValueOnce('base64-file');
        mockUrlToBase64.mockResolvedValueOnce('pdf-preview-img');
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.pdf', 'application/pdf');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockUrlToBase64).toHaveBeenCalledWith('mock-pdf.png');
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'base64-file')
        });

        expect(screen.getByText('my-file.pdf')).toBeInTheDocument();
        expect(await screen.findByAltText('Preview')).toHaveAttribute('src', 'pdf-preview-img');
    });

    it('should call onChange with .xlsx file and show XLSX preview', async () => {
        const mockOnChange = jest.fn();
        mockImageTypeValidator.mockReturnValueOnce({ valid: false });
        mockFileToBase64.mockResolvedValueOnce('xlsx-file-base64');
        mockUrlToBase64.mockResolvedValueOnce('xlsx-preview-img');
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(async () => {
            expect(mockUrlToBase64).toHaveBeenCalledWith('mock-xlsx.png');
            expect(await screen.findByAltText('Preview')).toHaveAttribute('src', 'xlsx-preview-img');
        });
    });

    it('should call onChange with doc file for unknown extensions', async () => {
        const mockOnChange = jest.fn();
        mockImageTypeValidator.mockReturnValueOnce({ valid: false });
        mockFileToBase64.mockResolvedValueOnce('default-file-base64');
        mockUrlToBase64.mockResolvedValueOnce('default-preview-img');
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(async () => {
            expect(mockUrlToBase64).toHaveBeenCalledWith('mock-doc.png');
            expect(await screen.findByAltText('Preview')).toHaveAttribute('src', 'default-preview-img');
        });
    });

    it('should properly handle input with no selected file', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange});

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: null } });
        expect(screen.getByText('No files selected')).toBeInTheDocument();
        await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), undefined));
    });

    it('should trigger input click when button is clicked', () => {
        renderComponent();
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        jest.spyOn(input, 'click');
        fireEvent.click(screen.getByRole('button'));
        expect(input.click).toHaveBeenCalled();
    });

    it('should not render preview if withPreview is false, even with file', async () => {
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

    it('should pass extra props to the input', () => {
        renderComponent({ 'data-testid': 'input-file', title: 'my-input' });
        expect(screen.getByTitle('my-input')).toBeInTheDocument();
        expect(screen.getByTestId('input-file')).toBeInTheDocument();
    });

});