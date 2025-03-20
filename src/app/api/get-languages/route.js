import { NextResponse } from "next/server";
import { generateClient } from "@/server/db";
export async function GET(request) {
    const prisma = await generateClient();
    const languages = await prisma.language.findMany();
    console.log("All langauges->", languages)

    return NextResponse.json({langauges: languages})

}
