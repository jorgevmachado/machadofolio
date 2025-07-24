import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    fileToBase64: jest.fn(),
    imageTypeValidator: jest.fn(),
    urlToBase64: jest.fn(),
}));

jest.mock('../../../utils', () => {
    const originalModule = jest.requireActual('../../../utils');
    return {
        ...originalModule,
        joinClass: (classes: any[]) => classes.filter(Boolean).join(' '),
        generateComponentId: jest.fn().mockReturnValue('mock-id'),
    }
})

jest.mock('../../../elements', () => ({
    Image: ({ src }: { src: string }) => (<img src={src} alt="Preview"/>)
}));
jest.mock('../../button', () => ({
    __esModule: true,
    default: (props: any) => (<button {...props} data-testid="mock-button"/>),
    Button: (props: any) => (<button {...props} data-testid="mock-button"/>),
}));

jest.mock('../../../assets/doc.png', () => 'mock-doc-image');
jest.mock('../../../assets/pdf.png', () => 'mock-pdf-image');
jest.mock('../../../assets/xlsx.png', () => 'mock-xlsx-image');

import { fileToBase64, imageTypeValidator, urlToBase64 } from '@repo/services';

function createFile(name: string, type = 'application/pdf') {
    const file = new File(['dummy content'], name, { type });
    Object.defineProperty(file, 'webkitRelativePath', { value: '', configurable: true });
    return file;

}

import FileInput from './FileInput';

describe('<FileInput/>', () => {
    const defaultProps = {
        name: 'file',
        label: 'File',
        accept: 'image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        context: 'neutral',
        isInvalid: false,
        onChange: jest.fn(),
    };

    const renderComponent = (props: any = {}) => {
        return render (<FileInput {...defaultProps} {...props}/>);
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Should render component with default props', () => {
        renderComponent();
        const component = screen.getByTestId('ds-file-input')
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-file-input');
    });

    it('should apply custom id and extra classes', () => {
        renderComponent({ id: 'my-id', className: 'custom-class' });
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(document.getElementById('my-id')).toBeInTheDocument();
        expect(document.querySelector('.ds-file-input')).toHaveClass('custom-class');
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

    it('should display error style when isInvalid', () => {
        renderComponent({ isInvalid: true });
        expect(document.querySelector('.ds-file-input__field')).toHaveClass('ds-file-input__field--error');
    });

    it('should accept the "accept" prop and pass it to <input>', () => {
        renderComponent({ accept: '.png,.pdf' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.accept).toBe('.png,.pdf');
    });

    it('should call onChange with file in base64 and handle image (with preview)', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('teste.png', 'image/png');
        (fileToBase64 as jest.Mock).mockResolvedValueOnce('base64-image');
        (imageTypeValidator as jest.Mock).mockReturnValueOnce({ valid: true });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'base64-image')
        });

        expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });

    it('should call onChange with PDF file and show PDF preview', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.pdf', 'application/pdf');
        (imageTypeValidator as jest.Mock).mockReturnValue({ valid: false });
        (fileToBase64 as jest.Mock).mockResolvedValue('base64-file');
        (urlToBase64 as jest.Mock).mockResolvedValue('pdf-preview-img');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'base64-file')
        });

        expect(screen.getByText('my-file.pdf')).toBeInTheDocument();
        expect(await screen.findByAltText('Preview')).toHaveAttribute('src', 'pdf-preview-img');
        expect(urlToBase64).toHaveBeenCalledWith('mock-pdf-image');
    });

    it('should call onChange with .xlsx file and show XLSX preview', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        (imageTypeValidator as jest.Mock).mockReturnValue({ valid: false });
        (fileToBase64 as jest.Mock).mockResolvedValue('xlsx-file-base64');
        (urlToBase64 as jest.Mock).mockResolvedValue('xlsx-preview-img');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(async () => {
            expect(await screen.findByAltText('Preview')).toHaveAttribute('src', 'xlsx-preview-img');
        });
        expect(urlToBase64).toHaveBeenCalledWith('mock-xlsx-image');
    });

    it('should call onChange with doc file for unknown extensions', async () => {
        const mockOnChange = jest.fn();
        renderComponent({ onChange: mockOnChange, withPreview: true });

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = createFile('my-file.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        (imageTypeValidator as jest.Mock).mockReturnValue({ valid: false });
        (fileToBase64 as jest.Mock).mockResolvedValue('default-file-base64');
        (urlToBase64 as jest.Mock).mockResolvedValue('default-preview-img');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(async () => {
            expect(await screen.findByAltText('Preview')).toHaveAttribute('src', 'default-preview-img');
        });
        expect(urlToBase64).toHaveBeenCalledWith('mock-doc-image');
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
        (imageTypeValidator as jest.Mock).mockReturnValue({ valid: true });
        (fileToBase64 as jest.Mock).mockResolvedValue('base64-image');
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

})