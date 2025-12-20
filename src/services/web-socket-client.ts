import EventBus from './event-bus';

export enum WebSocketClientEvents {
	Connected = 'connected',
	Close = 'close',
	Error = 'error',
	Message = 'message',
}

export class WebSocketClient extends EventBus {
	private socket?: WebSocket;
	private pingInterval?: ReturnType<typeof setInterval>;
	private readonly pingIntervalTime = 30000;
	private url: string;

	constructor(url: string) {
		super();
		this.url = url;
	}

	public send(data: string | number | object) {
		if (!this.socket) {
			throw new Error('Socket is not connected');
		}
        
		this.socket.send(JSON.stringify(data));
	}

	public connect(): Promise<void> {
		if (this.socket) {
			throw new Error('The socket is already connected');
		}
        
		this.socket = new WebSocket(this.url);
		this.subscribe(this.socket);
		this.setupPing();
        
		return new Promise((resolve, reject) => {
			this.on(WebSocketClientEvents.Error, reject);
			this.on(WebSocketClientEvents.Connected, () => {
				this.off(WebSocketClientEvents.Error, reject);
				resolve();
			});
		});
	}

	public close() {
		this.socket?.close();
		clearInterval(this.pingInterval);
	}

	private setupPing() {
		this.pingInterval = setInterval(() => {
			this.send({ type: 'ping' });
		}, this.pingIntervalTime);

		this.on(WebSocketClientEvents.Close, () => {
			clearInterval(this.pingInterval);
			this.pingInterval = undefined;
		});
	}

	private subscribe(socket: WebSocket) {
		socket.addEventListener('open', () => {
			this.emit(WebSocketClientEvents.Connected);
		});
        
		socket.addEventListener('close', () => {
			this.emit(WebSocketClientEvents.Close);
		});
        
		socket.addEventListener('error', (e: Event) => {
			this.emit(WebSocketClientEvents.Error, e);
		});
        
		socket.addEventListener('message', (message: MessageEvent) => {
			try {
				const data = JSON.parse(message.data);
				if (['pong', 'user connected'].includes(data?.type)) {
					return;
				}
				this.emit(WebSocketClientEvents.Message, data);
			} catch (error) {
				console.error('Error parsing JSON:', error);
			}
		});
	}
}
