const METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
};

type Options = {
	method?: string;
	timeout?: number;
	headers?: Record<string, string>;
	data?: Record<string, unknown> | FormData;
};

function queryStringify(data: Record<string, unknown>) {
	if (!Object.keys(data).length) {
		return '';
	}

	let result = '?';

	Object.keys(data).forEach(key => {
		const value = String(data[key]);
		result = result + key + '=' + value + '&';
	});

	return result.slice(0, -1);
}

class HttpClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	get = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHODS.GET },
			options.timeout,
		);
	};

	post = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHODS.POST },
			options.timeout,
		);
	};

	put = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHODS.PUT },
			options.timeout,
		);
	};

	delete = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHODS.DELETE },
			options.timeout,
		);
	};

	request = (url: string, options: Options, timeout = 5000): Promise<XMLHttpRequest> => {
		const { method, data } = options;

		return new Promise<XMLHttpRequest>((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			url = this.baseUrl + url;

			if (method === METHODS.GET && data && !(data instanceof FormData)) {
				url += queryStringify(data || {});
			}

			xhr.timeout = timeout;
			xhr.withCredentials = true;

			xhr.open(method || '', url);

			xhr.onload = function () {
				resolve(xhr);
			};

			if (options.headers) {
				Object.entries(options.headers).forEach(([key, value]) => {
					xhr.setRequestHeader(key, value);
				});
			}

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = function () {
				reject(new Error(`Request timeout ${timeout}ms`));
			};

			if (method === METHODS.GET || !data) {
				xhr.send();
			  } else if (data instanceof FormData) {
				xhr.send(data);
			  } else {
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(data));
			  }
			
		});
	};
}

export default HttpClient;
