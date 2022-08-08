import { SerializeType } from "@remix-run/react/dist/components";
import { Observable } from "rxjs";
import { interval, map, merge } from "rxjs";

/**
 * 创建一个 Event Source 源
 *
 * ```typescript
 * const eventSource = new EventSource('./event');
 * eventSource.addEventListener('message', ({ data }) => {
 *   const message = JSON.parse(data);
 *   // do something with message...
 * })
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#examples
 */
export function createEventSource<T>(
  request: Request,
  observable: Observable<T>
) {
  const body = new ReadableStream<string>({
    async start(c) {
      const subscription = merge(
        observable.pipe(map((item) => `data: ${JSON.stringify(item)}\n\n`)),
        interval(3000).pipe(map(() => ": kawaii is justice\n\n"))
      ).subscribe({
        next: (item) => c.enqueue(item),
        error: (err) => c.error(err),
      });
      request.signal.onabort = () => {
        subscription.unsubscribe();
        c.close();
      };
    },
  });

  const headers = new Headers();
  headers.set("Cache-Control", "no-store, no-transform");
  headers.set("Content-Type", "text/event-stream");
  return new Response(body, { headers, status: 200 });
}

export function fromEventSource<T>(url: string) {
  return new Observable<SerializeType<T>>((observer) => {
    const eventSource = new EventSource(url);
    eventSource.addEventListener("message", ({ data }) =>
      observer.next(JSON.parse(data))
    );
    eventSource.addEventListener("error", (event) => observer.error(event));
    observer.add(() => eventSource.close());
  });
}
