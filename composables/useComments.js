import { ref } from 'vue'

export default function useComments() {

  const CommentsData = ref(null)
  const CommentsError = ref(null)

  async function addComment(comment) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([comment])

      if (error) {
        CommentsError.value = error.message
      }

      CommentsData.value = data
      return data
    } catch (error) {
      CommentsError.value = error.message
    }

  }

  async function fetchComments(deliverable_content_id) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('deliverable_content_id', deliverable_content_id)

      if (error) {
        CommentsError.value = error.message
      }

      CommentsData.value = data
      return data

    } catch (error) {
      CommentsError.value = error.message
    }
  }

  return {
    CommentsData,
    CommentsError,
    addComment,
    fetchComments
  }
}