import fitz  # PyMuPDF

pdf_path = 'Ibrahim Ayub Desai Website.pdf'
doc = fitz.open(pdf_path)

for i, page in enumerate(doc):
    mat = fitz.Matrix(2, 2)  # 2x zoom = ~144 DPI, good quality
    pix = page.get_pixmap(matrix=mat)
    output_path = f'Ibrahim Ayub Desai Website Resume.png' if len(doc) == 1 else f'Ibrahim Ayub Desai Website Resume_{i+1}.png'
    pix.save(output_path)

print(f"Saved {len(doc)} page(s)")