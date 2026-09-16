import { ListTodo } from "lucide-react";

type QueueLauncherProps = { onOpen: () => void };

export function QueueLauncher({ onOpen }: QueueLauncherProps) {
  return <button className="canvas-queue-launcher canvas-icon-button" type="button" onClick={onOpen} aria-label="Abrir fila de trabalho" title="Abrir fila de trabalho"><ListTodo size={17} /></button>;
}
