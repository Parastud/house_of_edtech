import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../services/ai.service';

interface AIMentorState {
  isOpen: boolean;
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string; // accumulates chunks before committing to messages
  error: string | null;
}

const initialState: AIMentorState = {
  isOpen: false,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  error: null,
};

const aiMentorSlice = createSlice({
  name: 'aiMentor',
  initialState,
  reducers: {
    openMentor(state) {
      state.isOpen = true;
      state.error = null;
    },
    closeMentor(state) {
      state.isOpen = false;
    },
    addUserMessage(state, action: PayloadAction<string>) {
      const message: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: action.payload,
        timestamp: Date.now(),
      };
      state.messages.push(message);
      state.error = null;
    },
    // Called when first chunk arrives — starts a new assistant message
    startAssistantMessage(state) {
      state.isStreaming = true;
      state.streamingContent = '';
      state.error = null;
    },
    // Called for each streamed chunk — appends to streamingContent
    appendStreamChunk(state, action: PayloadAction<string>) {
      state.streamingContent += action.payload;
    },
    // Called when stream finishes — commits the full message to history
    commitAssistantMessage(state) {
      if (state.streamingContent.trim()) {
        const message: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: state.streamingContent,
          timestamp: Date.now(),
        };
        state.messages.push(message);
      }
      state.isStreaming = false;
      state.streamingContent = '';
    },
    setError(state, action: PayloadAction<string>) {
      state.isStreaming = false;
      state.streamingContent = '';
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearConversation(state) {
      state.messages = [];
      state.streamingContent = '';
      state.isStreaming = false;
      state.error = null;
    },
  },
});

export const {
  openMentor,
  closeMentor,
  addUserMessage,
  startAssistantMessage,
  appendStreamChunk,
  commitAssistantMessage,
  setError,
  clearError,
  clearConversation,
} = aiMentorSlice.actions;

export default aiMentorSlice.reducer;