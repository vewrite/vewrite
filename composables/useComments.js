import { ref } from 'vue'

export default function useComments() {

  const CommentsData = ref(null)
  const CommentsError = ref(null)
  const supabase = useSupabaseClient();

  async function addComment(comment) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)

      console.log('added: ', data)
      console.log('error: ', error)

      if (error) {
        CommentsError.value = error.message
      }

      console.log('added: ', data)

      CommentsData.value = data
      return data
    } catch (error) {
      CommentsError.value = error.message
      console.error
    }

  }

  async function fetchComments(deliverable_content_id) {
    console.log('fetching: ', deliverable_content_id)
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