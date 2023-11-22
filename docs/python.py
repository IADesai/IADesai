from pdf2image import convert_from_path

pdf_path = 'Ibrahim Ayub Desai Website.pdf'
images = convert_from_path(pdf_path)

for i, image in enumerate(images):
    image.save(f'Ibrahim Ayub Desai Website Resume.png', 'PNG')