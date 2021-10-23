import mailjet from 'node-mailjet';
import supabase from '$lib/db';

export async function post(req) {

    let to = [];
    let subject = '';
    let html = '';

    if(req.body.notificationType === 'New Question'){

        const res1 = await supabase
            .from('problems')
            .select('problemSet:problemSet_id (name, course:course_id (name, admins))')
            .eq('id', req.body.problem_id)
            .single();
        if(res1.error) throw res1.error;

        const res2 = await supabase
            .from('profiles')
            .select(`firstName, lastName, email`)
            .in('id', res1.data.problemSet.course.admins);
        if (res2.error) throw res2.error;

        for(admin of res2.data){
            to = [...to, {
                "Email": admin.email,
                "Name": admin.firstName + '' + admin.lastName
            }];
        }

        subject = '['+ res1.data.problemSet.course.name + '] New question about Problem ' + req.body.problemNumber + ' from ' + res1.data.problemSet.name;

        html = 'On Problem ' + req.body.problemNumber + ' from '+ res1.data.problemSet.name + ', ' + req.body.askedBy + ' asked: <blockquote>'
            + req.body.question + '</blockquote>To view Problem '+ req.body.problemNumber + ' and answer '+req.body.askedBy+"'s question, follow the link below:<br/><br/><a href='"+req.body.url+"'>"+ req.body.url+'</a>';

    }
    else if(req.body.notificationType === 'New Reply'){

        const res1 = await supabase
            .from('problems')
            .select('problemSet:problemSet_id (name, course:course_id (name, admins))')
            .eq('id', req.body.problem_id)
            .single();
        if(res1.error) throw res1.error;

        const res2 = await supabase
            .from('questions')
            .select('content, user_id (email)')
            .eq('id', req.body.question_id)
            .single();
        if (res2.error) throw res2.error;

        to = [{
                "Email": res2.data.user_id.email
            }];

        subject = '['+ res1.data.problemSet.course.name + '] New reply to your question about Problem ' + req.body.problemNumber + ' from ' + res1.data.problemSet.name;

        html = 'On Problem ' + req.body.problemNumber + ' from '+ res1.data.problemSet.name + ', you asked: <blockquote>'
            + res2.data.content + '</blockquote>'
            + req.body.repliedBy + ' replied: <blockquote>'
            + req.body.reply + '</blockquote>'
            + 'To view Problem '+ req.body.problemNumber + ', follow the link below:<br/><br/><a href="'+req.body.url+'">' + req.body.url+ '</a>';

    }

    const mailjetClient = mailjet
    .connect('9f64216135e46c87cad35b371bdef94d', '9f0c0f848179d759d2b1291143eee4ec')
    const request = mailjetClient
    .post("send", {'version': 'v3.1'})
    .request({
    "Messages":[
        {
        "From": {
            "Email": "no-reply@deductivelogic.org",
            "Name": "deductivelogic.org"
        },
        "To": to,
        "Subject": subject,
        "HTMLPart": html
        }
    ]
    })
    request
    .then((result) => {
        return {
            status: 200,
            body: result.body
        }
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
}