#!/usr/bin/env python3
import os
import zipfile

def package_infinityfree():
    dist_dir = os.path.abspath('dist')
    public_zip = os.path.abspath('public/htdocs_upload.zip')
    root_zip = os.path.abspath('htdocs_upload.zip')

    if not os.path.exists(dist_dir):
        print("dist directory does not exist. Run npm run build first.")
        return

    # Files and folders to include from dist:
    items_to_zip = [
        ('index.html', 'index.html'),
        ('index.php', 'index.php'),
        ('.htaccess', '.htaccess'),
        ('HOW_TO_UPLOAD.txt', 'HOW_TO_UPLOAD.txt'),
        ('assets', 'assets')
    ]

    print("Creating InfinityFree upload zip archive...")
    
    with zipfile.ZipFile(public_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for item_name, arc_name in items_to_zip:
            src_path = os.path.join(dist_dir, item_name)
            if not os.path.exists(src_path):
                # Fallback to public if missing in dist
                fallback = os.path.join('public', item_name)
                if os.path.exists(fallback):
                    src_path = fallback

            if os.path.isfile(src_path):
                zf.write(src_path, arc_name)
                print(f"  Added file: {arc_name}")
            elif os.path.isdir(src_path):
                for root, _, files in os.walk(src_path):
                    for file in files:
                        full_file = os.path.join(root, file)
                        rel_path = os.path.relpath(full_file, dist_dir)
                        # Exclude user chat screenshots from the deployment bundle
                        if 'aistudio' in rel_path:
                            continue
                        zf.write(full_file, rel_path)
                        print(f"  Added asset: {rel_path}")

    # Copy to root as well
    with open(public_zip, 'rb') as f_in, open(root_zip, 'wb') as f_out:
        f_out.write(f_in.read())

    # Also copy compiled index.html to public/compiled_index.html for direct individual download
    compiled_html_src = os.path.join(dist_dir, 'index.html')
    compiled_html_dst = os.path.join('public', 'compiled_index.html')
    if os.path.exists(compiled_html_src):
        with open(compiled_html_src, 'r', encoding='utf-8') as f_in, open(compiled_html_dst, 'w', encoding='utf-8') as f_out:
            f_out.write(f_in.read())
        print(f"  Copied compiled HTML to: {compiled_html_dst}")

    print(f"Successfully created: {public_zip} ({os.path.getsize(public_zip)} bytes)")
    print(f"Successfully created: {root_zip} ({os.path.getsize(root_zip)} bytes)")

if __name__ == '__main__':
    package_infinityfree()
