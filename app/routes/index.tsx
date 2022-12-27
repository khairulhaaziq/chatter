import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Login from "components/login";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import createServerSupabase from "utils/supabase.server";

export const action = async ({ request }: ActionArgs) => {
    const response = new Response();
    const supabase = createServerSupabase({ request, response });

    const {message} = Object.fromEntries(await request.formData());
    const {error} = await supabase.from("messages").insert({content: String(message)})

    if(error){
      console.log(error)
    }
    return json(null, { headers: response.headers });
};

// eslint-disable-next-line no-empty-pattern
export const loader = async ({ request }: LoaderArgs) => {
    const response = new Response();
    const supabase = createServerSupabase({ request, response });
    const { data } = await supabase.from("messages").select();
    return json({ messages: data ?? [] });
};

export default function Index() {
    const { messages } = useLoaderData<typeof loader>();
    return (
        <>
            <Login />
            <pre>{JSON.stringify(messages, null, 2)}</pre>
            <Form method="post">
                <input type="text" name="message" />
                <button type="submit">Send</button>
            </Form>
        </>
    );
}
