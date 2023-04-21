import {NativeEventSource, EventSourcePolyfill} from 'event-source-polyfill';

const EventSource = NativeEventSource || EventSourcePolyfill;

export default EventSource