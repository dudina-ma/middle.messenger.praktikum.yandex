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
	data?: Record<string, string>;
};

function queryStringify(data: Record<string, string>) {
	if (!Object.keys(data).length) {
		return '';
	}

	let result = '?';

	Object.keys(data).forEach(key => {
		const value = data[key].toString();
		result = result + key + '=' + value + '&';
	});

	return result.slice(0, -1);
}

export default class HTTPTransport {
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

	request = (url: string, options: Options, timeout = 5000) => {
		const { method, data } = options;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			if (method === METHODS.GET) {
				url += queryStringify(data || {});
			}

			xhr.timeout = timeout;

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
			} else if (method === METHODS.POST || method === METHODS.PUT) {
				if (!options.headers?.['Content-Type']) {
					xhr.setRequestHeader('Content-Type', 'application/json');
				}
				xhr.send(JSON.stringify(data));
			} else {
				xhr.send(JSON.stringify(data));
			}
		});
	};
}