import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const response = await fetch('/api/auth/user');
      
      if (response.status === 401) {
        // User is not authenticated - this is expected, not an error
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  const logout = async () => {
    try {
      await fetch('/api/logout');
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
  };
}
