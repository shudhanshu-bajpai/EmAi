import { db } from "@/server/db";

export const POST = async (req: Request) => {
    try {
        const { data } = await req.json();
        console.log("clerk webhook received", data);
        
        // Handle email extraction with fallbacks
        let email = "";
        
        if (data.email_addresses && data.email_addresses.length > 0) {
            email = data.email_addresses[0].email_address;
        } else if (data.primary_email_address_id) {
            // If we have a primary email ID but no email addresses array,
            // we might need to handle this differently or use a placeholder
            console.warn("Primary email ID found but no email addresses array");
            email = `user-${data.id}@temp.placeholder`;
        } else {
            console.error("No email addresses found in webhook data");
            return new Response('No email addresses found', { status: 400 });
        }
        
        console.log("Extracted email:", email);
        const firstname = data.first_name;
        const lastname = data.last_name;
        const imageUrl = data.image_url;
        const id = data.id;

        // Validate required fields
        if (!email || !id) {
            console.error("Missing required fields: email or id");
            return new Response('Missing required fields', { status: 400 });
        }

        await db.user.create({
            data: {
                id: id,
                email: email,
                firstname: firstname || "",
                lastname: lastname || "",
                imageUrl: imageUrl || ""
            }
        });
        
        console.log("user created successfully!", { id, email });
        return new Response('Webhook received', { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response('Internal server error', { status: 500 });
    }
}