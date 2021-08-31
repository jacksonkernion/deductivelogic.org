import supabase from '$lib/db'


export async function post(request) {
  let email = request.body.get('email')
  let password = request.body.get('password')

  console.log(email);

  const {session, error} = await supabase.auth.signIn({email, password})

  if (error) {
    return {
      status: error.status,
      body: error.message
    }
  }

  return {
    status: 200,
    body: 'success',
    headers: {
      'set-cookie': `session=${session.user}; Path=/home; HttpOnly; Secure; SameSite=Strict; Expires=${new Date(session.expires_at * 1000).toUTCString()};`
    }
  }
}


