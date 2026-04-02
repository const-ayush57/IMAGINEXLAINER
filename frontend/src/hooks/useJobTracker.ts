import { useState, useEffect } from "react";

export type JobState = "pending" | "processing" | "completed" | "failed" | "idle";

interface JobTrackerState {
  status: JobState;
  fileUrl: string | null;
  errorMessage: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useJobTracker = (jobId: string | null) => {
  const [state, setState] = useState<JobTrackerState>({
    status: "idle",
    fileUrl: null,
    errorMessage: null,
  });

  useEffect(() => {
    if (!jobId) {
      setState({ status: "idle", fileUrl: null, errorMessage: null });
      return;
    }

    // Unidirectional Pipeline mapping via `EventSource` Native implementation
    const sseUrl = `${API_URL}/jobs/${jobId}/stream`;
    
    // Polyfill / Native. `withCredentials: true` is crucial for verifying Authenticated JWT bindings into the SSE pipe!
    const source = new EventSource(sseUrl, { withCredentials: true });

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.heartbeat) return; // Discard automated keep-alive polling logs cleanly

        if (data.status === "completed") {
          setState({ status: "completed", fileUrl: data.fileUrl, errorMessage: null });
          source.close();
        } else if (data.status === "failed" || data.error) {
          setState({ status: "failed", fileUrl: null, errorMessage: data.errorMessage || data.error });
          source.close();
        } else if (data.status) {
          setState((prev) => ({ ...prev, status: data.status as JobState }));
        }

      } catch (err) {
        console.error("SSE stream payload failed parsing check:", err);
      }
    };

    source.onerror = (err) => {
      console.error("SSE Connection Network Breakage:", err);
      source.close();
      setState((prev) => ({ ...prev, status: "failed", errorMessage: "Real-time connection dropped actively." }));
    };

    return () => {
      source.close(); // Cleanup memory scopes when React dismounts explicitly closing HTTP persistent ties.
    };
  }, [jobId]);

  return state;
};
