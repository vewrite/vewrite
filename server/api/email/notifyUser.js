import { defineEventHandler, getQuery, createError, readBody } from 'h3';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
  // Get request parameters - prefer body for POST requests
  const body = await readBody(event).catch(() => ({}));
  const query = getQuery(event);
  
  const project_id = body.project_id || query.project_id;
  const deliverable_id = body.deliverable_id || query.deliverable_id;
  const user_id = body.user_id || query.user_id;
  
  if (!project_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing project_id parameter',
    });
  }

  if (!deliverable_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing deliverable_id parameter',
    });
  }

  if (!user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing user_id parameter',
    });
  }
  
  // Create Supabase client with SERVICE ROLE key (not anon key) so that we can send emails to the right user with the right information
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Missing service role key',
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const resend = new Resend(process.env.resendApiKey);

  if (!resend) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Missing Resend API key',
    });
  }
  
  try {
    // First, we have to get the email of the user_id to send the notification to
    const { data: userData, error: userError } = await supabase
      .from('profiles')  // Replace with your actual table name if different
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError) {  
      throw createError({
        statusCode: 400,
        statusMessage: `User retrieval error: ${userError.message}`,
      });
    }

    console.log('User data:', userData);

    const user = userData;

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User not found',
      });
    }

    // Next, we have to get the state of the deliverable
    const { data: deliverableData, error: deliverableError } = await supabase
      .from('deliverables')  // Replace with your actual table name if different
      .select('workflow_state')
      .eq('id', deliverable_id)
      .single();

    if (deliverableError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Deliverable retrieval error: ${deliverableError.message}`,
      });
    }

    console.log('Deliverable data:', deliverableData);

    const deliverable = deliverableData;

    if (!deliverable) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Deliverable state not found',
      });
    }

    // Then we have to go get the stateinstance of the deliverable
    const { data: stateInstanceData, error: stateInstanceError } = await supabase
      .from('stateinstances')  // Replace with your actual table name if different
      .select('id')
      .eq('id', deliverable.workflow_state)
      .single();

    if (stateInstanceError) {
      throw createError({
        statusCode: 400,
        statusMessage: `State instance retrieval error: ${stateInstanceError.message}`,
      });
    }

    console.log('State instance data:', stateInstanceData);

    const state_instance = stateInstanceData.id;
    
    // Next, we have to build the template of what we'll send to the user
    const template = {
      project_id: project_id,
      deliverable: deliverable,
      state_instance: state_instance,
      user: user,
    };

    const html = `<div style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; background: #ffffff; padding: 20px; border-radius: 10px;">
                    <svg data-v-87ab9939="" width="98" height="22" viewBox="0 0 98 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path data-v-87ab9939="" d="M92.9627 5.73975C93.8662 5.73975 94.6399 5.92541 95.2835 6.29675C95.9395 6.6557 96.447 7.17557 96.806 7.85634C97.1649 8.52474 97.3444 9.34167 97.3444 10.3071V11.4954H90.6975C90.7223 12.4114 90.976 13.1231 91.4588 13.6306C91.9415 14.1257 92.6099 14.3732 93.464 14.3732C94.12 14.3732 94.7017 14.3113 95.2092 14.1876C95.7291 14.0514 96.2613 13.8596 96.806 13.612V15.4872C96.3109 15.7224 95.7972 15.8957 95.2649 16.0071C94.7327 16.1185 94.0952 16.1742 93.3526 16.1742C92.3747 16.1742 91.5021 15.9885 90.7347 15.6172C89.9796 15.2335 89.3855 14.6579 88.9523 13.8905C88.5314 13.1231 88.321 12.17 88.321 11.0312C88.321 9.8801 88.5129 8.91464 88.8966 8.13484C89.2927 7.34267 89.8373 6.74853 90.5304 6.35244C91.2236 5.94398 92.0343 5.73975 92.9627 5.73975ZM92.9627 7.46644C92.3438 7.46644 91.8363 7.67068 91.4402 8.07914C91.0565 8.47523 90.8275 9.06936 90.7532 9.86154H95.0793C95.0793 9.39118 94.9988 8.97653 94.8379 8.61757C94.6894 8.25862 94.4604 7.98012 94.1509 7.78208C93.8415 7.57165 93.4454 7.46644 92.9627 7.46644Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M85.2715 14.2989C85.5685 14.2989 85.8532 14.2742 86.1255 14.2247C86.3978 14.1628 86.6516 14.0947 86.8868 14.0204V15.7657C86.6392 15.8771 86.3174 15.9699 85.9213 16.0442C85.5252 16.1308 85.1105 16.1741 84.6773 16.1741C84.1079 16.1741 83.5881 16.0813 83.1177 15.8957C82.6598 15.6976 82.2884 15.3634 82.0037 14.8931C81.7314 14.4227 81.5953 13.7667 81.5953 12.925V7.6892H80.2399V6.66804L81.7252 5.8511L82.4679 3.71594H83.9347V5.92537H86.7939V7.6892H83.9347V12.9064C83.9347 13.3768 84.0584 13.7295 84.306 13.9647C84.5535 14.1875 84.8754 14.2989 85.2715 14.2989Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M78.3812 5.92535V15.9885H76.0418V5.92535H78.3812ZM77.2115 2.04492C77.5581 2.04492 77.8613 2.13776 78.1213 2.32342C78.3812 2.49671 78.5112 2.81234 78.5112 3.27032C78.5112 3.71592 78.3812 4.03774 78.1213 4.23578C77.8613 4.42145 77.5581 4.51428 77.2115 4.51428C76.8525 4.51428 76.5431 4.42145 76.2832 4.23578C76.0356 4.03774 75.9118 3.71592 75.9118 3.27032C75.9118 2.81234 76.0356 2.49671 76.2832 2.32342C76.5431 2.13776 76.8525 2.04492 77.2115 2.04492Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M73.1556 5.73975C73.3041 5.73975 73.4774 5.74593 73.6754 5.75831C73.8735 5.77069 74.0406 5.79545 74.1767 5.83258L73.9725 8.00488C73.8611 7.98012 73.7126 7.96155 73.5269 7.94918C73.3536 7.92442 73.1989 7.91204 73.0627 7.91204C72.6914 7.91204 72.3325 7.97393 71.9859 8.09771C71.6517 8.20911 71.3484 8.3824 71.0761 8.61757C70.8162 8.84037 70.6058 9.13125 70.4449 9.49021C70.2963 9.84916 70.2221 10.2762 70.2221 10.7713V15.9885H67.8827V5.92541H69.6836L70.0178 7.67068H70.1292C70.3273 7.31172 70.5748 6.9899 70.8719 6.70521C71.169 6.40814 71.5093 6.17297 71.8931 5.99968C72.2891 5.82639 72.71 5.73975 73.1556 5.73975Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M59.6005 11.6625C59.5386 11.4273 59.4643 11.1364 59.3777 10.7898C59.291 10.4309 59.1982 10.0595 59.0992 9.67583C59.0125 9.29212 58.9259 8.93935 58.8392 8.61753C58.765 8.29571 58.7155 8.04815 58.6907 7.87486H58.6164C58.5793 8.04815 58.5236 8.29571 58.4493 8.61753C58.3751 8.93935 58.2946 9.29212 58.208 9.67583C58.1213 10.0595 58.0285 10.4309 57.9295 10.7898C57.8428 11.1488 57.7686 11.4458 57.7067 11.681L56.537 15.9885H53.9748L51.1526 5.9068H53.5106L54.7546 10.7156C54.8412 11.0374 54.9217 11.4025 54.9959 11.811C55.0826 12.2195 55.1569 12.6155 55.2187 12.9993C55.2806 13.3706 55.324 13.6738 55.3487 13.909H55.423C55.4477 13.7481 55.4787 13.5377 55.5158 13.2778C55.5529 13.0054 55.5963 12.7269 55.6458 12.4423C55.7077 12.1452 55.7634 11.8729 55.8129 11.6253C55.8748 11.3778 55.9243 11.1859 55.9614 11.0498L57.4096 5.9068H59.9718L61.3643 11.0498C61.4262 11.2726 61.4943 11.5634 61.5685 11.9224C61.6428 12.2813 61.7109 12.6403 61.7728 12.9993C61.8347 13.3582 61.8718 13.6553 61.8842 13.8904H61.9584C61.9832 13.68 62.0265 13.3953 62.0884 13.0364C62.1503 12.6651 62.2245 12.269 62.3112 11.8481C62.3978 11.4273 62.4907 11.0498 62.5897 10.7156L63.8522 5.9068H66.1731L63.3138 15.9885H60.7145L59.6005 11.6625Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M46.0928 5.73975C46.9964 5.73975 47.77 5.92541 48.4137 6.29675C49.0697 6.6557 49.5772 7.17557 49.9361 7.85634C50.2951 8.52474 50.4746 9.34167 50.4746 10.3071V11.4954H43.8277C43.8525 12.4114 44.1062 13.1231 44.5889 13.6306C45.0717 14.1257 45.7401 14.3732 46.5941 14.3732C47.2501 14.3732 47.8319 14.3113 48.3394 14.1876C48.8593 14.0514 49.3915 13.8596 49.9361 13.612V15.4872C49.441 15.7224 48.9273 15.8957 48.3951 16.0071C47.8628 16.1185 47.2254 16.1742 46.4827 16.1742C45.5049 16.1742 44.6323 15.9885 43.8648 15.6172C43.1098 15.2335 42.5157 14.6579 42.0824 13.8905C41.6616 13.1231 41.4512 12.17 41.4512 11.0312C41.4512 9.8801 41.643 8.91464 42.0267 8.13484C42.4228 7.34267 42.9674 6.74853 43.6606 6.35244C44.3538 5.94398 45.1645 5.73975 46.0928 5.73975ZM46.0928 7.46644C45.4739 7.46644 44.9665 7.67068 44.5704 8.07914C44.1867 8.47523 43.9577 9.06936 43.8834 9.86154H48.2094C48.2094 9.39118 48.129 8.97653 47.9681 8.61757C47.8195 8.25862 47.5905 7.98012 47.2811 7.78208C46.9717 7.57165 46.5756 7.46644 46.0928 7.46644Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M34.2306 15.9885L30.4059 5.92535H32.8753L34.8805 11.7367C34.9671 11.9719 35.0476 12.2318 35.1218 12.5165C35.1961 12.7888 35.258 13.0611 35.3075 13.3334C35.3694 13.5934 35.4065 13.8224 35.4189 14.0204H35.4932C35.5179 13.81 35.5612 13.5748 35.6231 13.3149C35.685 13.0426 35.7531 12.7703 35.8274 12.4979C35.914 12.2256 35.9945 11.9719 36.0687 11.7367L38.0739 5.92535H40.5433L36.7186 15.9885H34.2306Z" fill="#FFFFFF"></path><path data-v-87ab9939="" d="M21.0884 1.38745C22.4157 2.15372 22.8704 3.85082 22.1041 5.17804L13.7794 19.5969C13.0131 20.9241 11.316 21.3788 9.98883 20.6125V20.6125C8.66161 19.8463 8.20687 18.1492 8.97314 16.822L17.2979 2.40314C18.0641 1.07592 19.7612 0.621182 21.0884 1.38745V1.38745Z" fill="url(#paint0_linear_29_63)"></path><path data-v-87ab9939="" fill-rule="evenodd" clip-rule="evenodd" d="M5.45472 2.40317C4.68845 1.07596 2.99134 0.62122 1.66413 1.38749C0.336913 2.15376 -0.117824 3.85086 0.648445 5.17808L8.97315 19.5969C9.73942 20.9241 11.4365 21.3789 12.7637 20.6126C13.3104 20.297 13.7091 19.8234 13.9354 19.2828L16.7482 14.4242C16.3782 14.7942 15.4163 15.6452 14.5283 16.0891C13.993 16.3568 13.4307 15.9655 12.9875 15.4504L5.45472 2.40317Z" fill="url(#paint1_linear_29_63)"></path><defs data-v-87ab9939=""><linearGradient data-v-87ab9939="" id="paint0_linear_29_63" x1="22.853" y1="5.82196" x2="6.75856" y2="14.7017" gradientUnits="userSpaceOnUse"><stop data-v-87ab9939="" offset="0.0897277" stop-color="#C3D5AD"></stop><stop data-v-87ab9939="" offset="0.776664" stop-color="#BFCDFF"></stop></linearGradient><linearGradient data-v-87ab9939="" id="paint1_linear_29_63" x1="2.31873" y1="9.15189" x2="9.53348" y2="21.084" gradientUnits="userSpaceOnUse"><stop data-v-87ab9939="" stop-color="#9AB1FD"></stop><stop data-v-87ab9939="" offset="1" stop-color="#6C8DFB"></stop></linearGradient></defs></svg>
                    <h3>Message from Vewrite</h3>
                    
                    <div>We have a new deliverable for you to review.</div>
                    <div>Project ID: ${template.project_id}</div>
                    <div>Deliverable ID: ${template.deliverable.id}</div>
                    <div>Deliverable State: ${template.deliverable.workflow_state}</div>
                    <div>User Email: ${template.user.email}</div>
                  </div>
                  `;


    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Vewrite <noreply@vewrite.com>',
      to: [user.email],
      subject: '${deliverable.title} is now in state ${state_instance.name}',
      html: html,
    });
  
    if (error) {
      return console.error({ error });
    }
  
    console.log({ data });
    
    return {
      success: true,
      message: `Invitation sent to ${user.email}`,
      data
    };
  } catch (error) {
    console.error('Server error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to notify user',
    });
  }
});