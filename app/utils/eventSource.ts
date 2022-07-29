import type { Observable } from "rxjs";

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
 */
export function createEventSource<T>(
  request: Request,
  observable: Observable<T>
) {
  const body = new ReadableStream({
    async start(c) {
      const subscription = observable.subscribe({
        next(item) {
          c.enqueue(`data: ${JSON.stringify(item)}\n\n`);
        },
        error(error) {
          c.error(error);
        },
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
