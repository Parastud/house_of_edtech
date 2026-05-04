import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import {
    addUserMessage,
    appendStreamChunk,
    clearConversation,
    closeMentor,
    commitAssistantMessage,
    openMentor,
    setError,
    startAssistantMessage,
} from '../redux/slices/aiMentor.slice';
import { AIMentorContext, streamAIMentorResponse } from '../services/ai.service';

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY ?? '';

export const useAIMentor = () => {
  const dispatch = useAppDispatch();

  const { isOpen, messages, isStreaming, streamingContent, error } =
    useAppSelector((s) => s.aiMentor);

  const isConnected = useAppSelector((s) => s.network.isConnected);
  const courses = useAppSelector((s) => s.courses.items);
  const bookmarkedIds = useAppSelector((s) => s.bookmarks.ids);
  const username = useAppSelector((s) => s.user.username);
  const enrolledIds = useMemo(
    () => courses.filter((c) => c.isEnrolled).map((c) => c.id),
    [courses],
  );

  const open = useCallback(() => dispatch(openMentor()), [dispatch]);
  const close = useCallback(() => dispatch(closeMentor()), [dispatch]);
  const clear = useCallback(() => dispatch(clearConversation()), [dispatch]);

  const sendMessage = useCallback(
    async (userInput: string) => {
      const trimmed = userInput.trim();
      if (!trimmed || isStreaming) return;

      // ── Offline guard ──────────────────────────────────────────────────
      if (!isConnected) {
        dispatch(setError('No internet connection. Please check your network.'));
        return;
      }

      if (!OPENAI_KEY) {
        dispatch(setError('AI Mentor is not configured. Please add your OpenAI key.'));
        return;
      }

      // ── Add user message to Redux ──────────────────────────────────────
      dispatch(addUserMessage(trimmed));
      dispatch(startAssistantMessage());

      // ── Build context from current Redux state ─────────────────────────
      // This is what makes the AI genuinely contextual — it knows the full
      // catalog, what the user has bookmarked, and what they've enrolled in.
      const context: AIMentorContext = {
        courses,
        bookmarkedIds,
        enrolledIds,
        username,
      };

      // ── Stream the response ────────────────────────────────────────────
      // Pass updated messages including the one we just added
      const updatedMessages = [
        ...messages,
        {
          id: `user_${Date.now()}`,
          role: 'user' as const,
          content: trimmed,
          timestamp: Date.now(),
        },
      ];

      await streamAIMentorResponse({
        messages: updatedMessages,
        context,
        apiKey: OPENAI_KEY,
        onChunk: (chunk) => {
          dispatch(appendStreamChunk(chunk));
        },
        onDone: () => {
          dispatch(commitAssistantMessage());
        },
        onError: (errorMsg) => {
          dispatch(setError(errorMsg));
        },
      });
    },
    [
      dispatch,
      isStreaming,
      isConnected,
      messages,
      courses,
      bookmarkedIds,
      enrolledIds,
      username,
    ],
  );

  return {
    isOpen,
    messages,
    isStreaming,
    streamingContent,
    error,
    open,
    close,
    clear,
    sendMessage,
  };
};