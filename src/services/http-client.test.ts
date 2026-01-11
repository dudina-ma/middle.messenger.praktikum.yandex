import HttpClient from './http-client';

describe('HttpClient', () => {
	let httpClient: HttpClient;
	let mockXHR: {
		open: jest.Mock;
		send: jest.Mock;
		setRequestHeader: jest.Mock;
		onload: (() => void) | null;
		onerror: (() => void) | null;
		onabort: (() => void) | null;
		ontimeout: (() => void) | null;
		status: number;
		statusText: string;
		responseText: string;
		timeout: number;
		withCredentials: boolean;
	};

	beforeEach(() => {
		mockXHR = {
			open: jest.fn(),
			send: jest.fn(),
			setRequestHeader: jest.fn(),
			onload: null,
			onerror: null,
			onabort: null,
			ontimeout: null,
			status: 200,
			statusText: 'OK',
			responseText: '{}',
			timeout: 0,
			withCredentials: false,
		};

		(globalThis as any).XMLHttpRequest = jest.fn(function(this: any) {
			return mockXHR;
		}) as any;

		httpClient = new HttpClient('https://api.example.com');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('GET request', () => {
		it('should call open with correct method and URL', async () => {
			httpClient.get('/users');

			expect(mockXHR.open).toHaveBeenCalledWith('GET', 'https://api.example.com/users');
			expect(mockXHR.open).toHaveBeenCalledTimes(1);
		});

		it('should add query string for GET request with data', async () => {
			const data = { page: 1, limit: 10 };
			httpClient.get('/users', { data });

			expect(mockXHR.open).toHaveBeenCalledWith(
				'GET',
				'https://api.example.com/users?page=1&limit=10'
			);
		});

		it('should call send without body for GET request', async () => {
			httpClient.get('/users');

			expect(mockXHR.send).toHaveBeenCalledWith();
			expect(mockXHR.send).toHaveBeenCalledTimes(1);
		});
	});

	describe('POST request', () => {
		it('should call open with POST method', async () => {
			httpClient.post('/users', { data: { name: 'John' } });

			expect(mockXHR.open).toHaveBeenCalledWith('POST', 'https://api.example.com/users');
		});

		it('should set Content-Type header and send JSON data', async () => {
			const data = { name: 'John', age: 30 };
			httpClient.post('/users', { data });

			expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
			expect(mockXHR.send).toHaveBeenCalledWith(JSON.stringify(data));
		});

		it('should send FormData without setting Content-Type', async () => {
			const formData = new FormData();
			formData.append('name', 'John');
			httpClient.post('/users', { data: formData });

			expect(mockXHR.setRequestHeader).not.toHaveBeenCalledWith('Content-Type', 'application/json');
			expect(mockXHR.send).toHaveBeenCalledWith(formData);
		});
	});

	describe('PUT request', () => {
		it('should call open with PUT method', async () => {
			httpClient.put('/users/1', { data: { name: 'Jane' } });

			expect(mockXHR.open).toHaveBeenCalledWith('PUT', 'https://api.example.com/users/1');
		});
	});

	describe('DELETE request', () => {
		it('should call open with DELETE method', async () => {
			httpClient.delete('/users/1');

			expect(mockXHR.open).toHaveBeenCalledWith('DELETE', 'https://api.example.com/users/1');
			expect(mockXHR.send).toHaveBeenCalledWith();
		});
	});

	describe('Headers', () => {
		it('should set custom headers', async () => {
			const headers = { Authorization: 'Bearer token123', 'X-Custom-Header': 'value' };
			httpClient.get('/users', { headers });

			expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer token123');
			expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('X-Custom-Header', 'value');
		});
	});

	describe('Configuration', () => {
		it('should set timeout', async () => {
			httpClient.get('/users', { timeout: 10000 });

			expect(mockXHR.timeout).toBe(10000);
		});

		it('should set withCredentials to true', async () => {
			httpClient.get('/users');

			expect(mockXHR.withCredentials).toBe(true);
		});
	});

	describe('Error handling', () => {
		it('should reject on HTTP error status (4xx)', async () => {
			const promise = httpClient.get('/users');

			mockXHR.status = 404;
			mockXHR.statusText = 'Not Found';

			if (mockXHR.onload) {
				mockXHR.onload();
			}

			await expect(promise).rejects.toThrow('HTTP Error: 404 Not Found');
		});

		it('should reject on HTTP error status (5xx)', async () => {
			const promise = httpClient.get('/users');

			mockXHR.status = 500;
			mockXHR.statusText = 'Internal Server Error';

			if (mockXHR.onload) {
				mockXHR.onload();
			}

			await expect(promise).rejects.toThrow('HTTP Error: 500 Internal Server Error');
		});

		it('should include error reason in rejected error', async () => {
			const promise = httpClient.get('/users');

			mockXHR.status = 400;
			mockXHR.statusText = 'Bad Request';
			mockXHR.responseText = JSON.stringify({ reason: 'Invalid data' });

			if (mockXHR.onload) {
				mockXHR.onload();
			}

			try {
				await promise;
			} catch (error: any) {
				expect(error.reason).toBe('Invalid data');
				expect(error.xhr).toBe(mockXHR);
			}
		});

		it('should handle invalid JSON in error response', async () => {
			const promise = httpClient.get('/users');

			mockXHR.status = 400;
			mockXHR.statusText = 'Bad Request';
			mockXHR.responseText = 'Invalid JSON';

			if (mockXHR.onload) {
				mockXHR.onload();
			}

			await expect(promise).rejects.toThrow('HTTP Error: 400 Bad Request');
		});

        it('should reject on network error', async () => {
            const promise = httpClient.get('/users');

            if (mockXHR.onerror) {
                mockXHR.onerror();
            }

            await expect(promise).rejects.toThrow('Network error occurred');
        });

        it('should reject on abort', async () => {
            const promise = httpClient.get('/users');

            if (mockXHR.onabort) {
                mockXHR.onabort();
            }

            await expect(promise).rejects.toThrow('Request was aborted');
        });

		it('should reject on timeout', async () => {
			const promise = httpClient.get('/users', { timeout: 1000 });

			if (mockXHR.ontimeout) {
				mockXHR.ontimeout();
			}

			await expect(promise).rejects.toThrow('Request timeout 1000ms');
		});
	});

	describe('Success handling', () => {
		it('should resolve with xhr object on success', async () => {
			const promise = httpClient.get('/users');

			mockXHR.status = 200;
			if (mockXHR.onload) {
				mockXHR.onload();
			}

			const result = await promise;
			expect(result).toBe(mockXHR);
		});

		it('should resolve with xhr object for status 200', async () => {
			const promise = httpClient.get('/users');

			mockXHR.status = 200;
			if (mockXHR.onload) {
				mockXHR.onload();
			}

			const result = await promise;
			expect(result.status).toBe(200);
		});

		it('should resolve with xhr object for status 201', async () => {
			const promise = httpClient.post('/users', { data: { name: 'John' } });

			mockXHR.status = 201;
			if (mockXHR.onload) {
				mockXHR.onload();
			}

			const result = await promise;
			expect(result.status).toBe(201);
		});
	});
});
