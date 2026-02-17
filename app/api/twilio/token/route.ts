import { NextResponse } from 'next/server';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

export async function GET() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID;

    if (!accountSid || !apiKey || !apiSecret || !chatServiceSid) {
        return NextResponse.json({ error: 'Missing Twilio credentials' }, { status: 500 });
    }

    // Create an identity for the user
    const identity = `guest_${Math.random().toString(36).substring(7)}`;

    // Create an access token
    const token = new AccessToken(
        accountSid,
        apiKey,
        apiSecret,
        { identity: identity }
    );

    // Add the chat grant to the token
    const chatGrant = new ChatGrant({
        serviceSid: chatServiceSid,
    });
    token.addGrant(chatGrant);

    return NextResponse.json({
        identity: identity,
        token: token.toJwt(),
    });
}
