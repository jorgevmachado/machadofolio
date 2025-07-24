import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

(global as any).__shouldFileReaderFail = false;

class FileReaderMock {
    result: string | null = null;
    onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
    onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
    onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

    readAsDataURL(_file: Blob) {
        if((global as any).__shouldFileReaderFail) {
            const error = new Error('Simulated error');

            if(typeof this.onerror === 'function') {
                // @ts-ignore
                this.onerror(error as any);

            }
            if(typeof this.onloadend === 'function') {
                // @ts-ignore
                this.onloadend({ target: this, error} as any);
            }
        } else {
            this.result = 'data:base64,mocked-data';

            if (typeof this.onload === 'function') {
                // @ts-ignore
                this.onload({ target: this } as any);
            }
            if (typeof this.onloadend === 'function') {
                // @ts-ignore
                this.onloadend({ target: this } as any);
            }
        }

    }
}

Object.defineProperty(global, 'FileReader', {
    writable: true,
    value: FileReaderMock,
});
