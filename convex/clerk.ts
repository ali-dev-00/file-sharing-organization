'use node';

import type { WebhookEvent} from "@clerk/clerk-sdk-node";
import { v } from "convex/values";
import {Webhook} from "svix";
import { internalAction } from "./_generated/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '' ;

export const fulfill =internalAction({
    args : { header : v.any() , payload : v.string() },
    handler : async (ctx ,args) =>{
       const wh = new Webhook(webhookSecret);
       const payload = wh.verify(args.payload,args.header) as WebhookEvent ;
       return payload ;
    }
})