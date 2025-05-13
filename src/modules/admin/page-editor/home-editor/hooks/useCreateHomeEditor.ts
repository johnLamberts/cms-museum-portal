// src/modules/admin/page-editor/hooks/useCreateHomeEditor.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HomeFormData } from '../home-content';
import homeEditorService from '../service/home-editor.service';

export default function useCreateHomeEditor() {
 
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: HomeFormData) => homeEditorService.addHomeEdits(data),
    onSuccess: (data) => {
      // Update or invalidate relevant queries after successful mutation
      queryClient.invalidateQueries({ queryKey: ['homepage_editor'] });
      
      // You could also directly update the cache instead of invalidating
      queryClient.setQueryData(['homepage_editor', data.home_id], data);
    }
  });

  return {
    addHomeHandler: mutation.mutateAsync,
    isAddingHomeEditor: mutation.isPending,
    error: mutation.error
  };
}
