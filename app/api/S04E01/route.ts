import path from 'path';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    if (type == "download") {  
        
        async function encodeFileToBase64(filePath: string): Promise<string> {
            return new Promise((resolve, reject) => {
                fs.readFile(filePath, (err, data) => {
                    if (err) reject(err);
                    else resolve(data.toString('base64'));
                });
            });
        }

        return NextResponse.json({ response: [
            { 
                url: "src/S04E01/IMG_1410-small.PNG",
                base64: await encodeFileToBase64("src/S04E01/IMG_1410-small.PNG")
            },
            {
                url: "src/S04E01/IMG_559-small.PNG",
                base64: await encodeFileToBase64("src/S04E01/IMG_559-small.PNG")
            },
            {
                url:"src/S04E01/IMG_1443-small.PNG",
                base64: await encodeFileToBase64("src/S04E01/IMG_1443-small.PNG")
            },
            {
                url: "src/S04E01/IMG_1444-small.PNG",
                base64: await encodeFileToBase64("src/S04E01/IMG_1444-small.PNG")
            }
     ] });
    }
}

async function downloadFiles(imageLinks: string[]) {
    console.log("downloadFiles", imageLinks)
    //const imageLinks = images.split(',');
    const downloadPath = path.join(__dirname, '../../../src/S04E01');

    if (!Array.isArray(imageLinks)) {
        throw new Error('imageLinks must be an array: '+ imageLinks);
    }

    const downloadPromises = imageLinks.map(async (url) => {
        let smallUrl = url.replace(".PNG", "-small.PNG").trim();
        console.log("smallUrl", smallUrl)
        const response = await fetch(smallUrl);
        if (!response.ok) {
            throw new Error(`Failed to download image from ${url}`);
        }
        const buffer = await response.buffer();
        const fileName = path.basename(url);
        const filePath = path.join(downloadPath, fileName);
        await fs.writeFile(filePath, buffer);
        return filePath;
    });

    const filePaths = await Promise.all(downloadPromises);
    return filePaths.join(',');
}

async function encodeFileToBase64(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            else resolve(data.toString('base64'));
        });
    });
}