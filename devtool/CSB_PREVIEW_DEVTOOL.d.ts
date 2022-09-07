type Message = {
  type: 'FOCUS_FILE'
  path: string
}

  interface Window {
    __CSB_PREVIEW_PROTOCOL: {
        sendMessage(message: Message): void
    };
  }
