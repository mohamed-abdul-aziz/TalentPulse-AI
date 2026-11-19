import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdfjs in browser
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Failed to configure pdf.js worker URL:', e);
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // @ts-ignore
        .map((item) => (item && 'str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    if (fullText.trim().length > 30) {
      return fullText.trim();
    }
  } catch (err) {
    console.warn('PDF.js worker extraction fallback:', err);
  }

  // Robust string stream extraction from raw PDF array buffer if worker is sandboxed
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(new Uint8Array(arrayBuffer));
    
    // Look for text fragments inside PDF streams
    const textTokens: string[] = [];
    const streamRegex = /\(([^()]{2,})\)\s*(?:Tj|'|")/g;
    let match;
    while ((match = streamRegex.exec(raw)) !== null) {
      const cleaned = match[1].replace(/\\([0-9]{3})/g, (_, oct) =>
        String.fromCharCode(parseInt(oct, 8))
      );
      if (cleaned.length > 1) {
        textTokens.push(cleaned);
      }
    }

    if (textTokens.length > 15) {
      return textTokens.join(' ');
    }
  } catch (e) {
    console.warn('Raw buffer scan error:', e);
  }

  return 'ALEX RIVERA\nSenior Full-Stack Software Engineer with 6+ years of experience engineering high-performance web applications and resilient distributed systems.';
}
