import { NextResponse } from "next/server";
import mammoth from "mammoth";
import pdfParse from 'pdf-parse/lib/pdf-parse';

import type { ParseDocumentResponse } from "@/shared/schema";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          message: "Unsupported file type. Please upload a PDF or DOCX file.",
          supportedTypes: ["PDF", "DOCX"]
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    let extractedText = "";
    let fileType: "pdf" | "docx";

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      if (file.type === "application/pdf") {
        // Parse PDF
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
        fileType = "pdf";
      } else {
        // Parse DOCX
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
        fileType = "docx";
      }
    } catch (parseError) {
      console.error("Error parsing document:", parseError);
      return NextResponse.json(
        { 
          message: "Failed to parse the document. The file may be corrupted or password-protected.",
          error: parseError instanceof Error ? parseError.message : "Unknown parsing error"
        },
        { status: 422 }
      );
    }

    // Clean up the text (remove excessive whitespace, normalize line breaks)
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText) {
      return NextResponse.json(
        { message: "No text content found in the document." },
        { status: 422 }
      );
    }

    // Calculate word count
    const wordCount = cleanedText
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    const response: ParseDocumentResponse = {
      text: cleanedText,
      filename: file.name,
      fileType,
      wordCount,
      success: true
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error in document parsing endpoint:", error);
    return NextResponse.json(
      { 
        message: "Internal server error occurred while processing the document.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 