import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { latex } = await req.json();
        if (!latex) return NextResponse.json({ error: "No latex provided" }, { status: 400 });

        const formData = new FormData();
        const fileBlob = new Blob([latex], { type: 'text/plain' });
        formData.append('file', fileBlob, 'main.tex');
        formData.append('command', 'pdflatex');

        const response = await fetch('https://latexonline.cc/compile', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("LaTeX Compilation Failed:", errorText);
            return NextResponse.json({ error: "LaTeX compilation failed. Please check your syntax or try again." }, { status: 500 });
        }

        const pdfBuffer = await response.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="resume.pdf"',
            },
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Failed to compile PDF" }, { status: 500 });
    }
}
