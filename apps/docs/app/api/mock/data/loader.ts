import chatData from './chat.json';
import chatWidgetData from './chat-widget.json';
import multiAgentData from './multi-agent.json';

const datasets: Record<string, any> = {
  chat: chatData,
  'chat-widget': chatWidgetData,
  'multi-agent': multiAgentData,
};

export function getDataset(example: string) {
  return datasets[example] || null;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};
