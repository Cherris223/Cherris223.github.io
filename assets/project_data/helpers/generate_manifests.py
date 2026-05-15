import json
from pathlib import Path

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
VIDEO_EXTS = {".mp4", ".webm", ".mov"}
PDF_EXTS = {".pdf"}


def classify_file(file_path):
    ext = file_path.suffix.lower()

    if ext in IMAGE_EXTS:
        return "image"
    elif ext in VIDEO_EXTS:
        return "video"
    elif ext in PDF_EXTS:
        return "pdf"
    else:
        return "file"


def clean_title(file_path):
    name = file_path.stem
    name = name.replace("_", " ").replace("-", " ")
    return name.title()


def generate_manifest(project_dir):
    project_dir = Path(project_dir)

    if not project_dir.exists():
        print(f"Skipping missing directory: {project_dir}")
        return

    output_path = project_dir / "manifest.json"

    if output_path.exists():
        output_path.unlink()

    gallery = []

    for file in sorted(project_dir.iterdir()):
        if file.name == "manifest.json":
            continue

        if file.name == ".DS_Store":
            continue

        if file.name.lower() == "projecticon.png":
            continue

        if file.is_dir():
            continue

        file_type = classify_file(file)

        item = {
            "type": file_type,
            "src": file.name
        }

        if file_type in {"image", "video"}:
            item["caption"] = clean_title(file)
        else:
            item["title"] = clean_title(file)

        gallery.append(item)

    manifest = {
        "gallery": gallery
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Generated: {output_path}")


def generate_all_manifests(parent_dir):
    parent_dir = Path(parent_dir)

    if not parent_dir.exists():
        raise FileNotFoundError(f"Directory not found: {parent_dir}")

    for folder in sorted(parent_dir.iterdir()):
        if folder.is_dir():
            print(f"Processing: {folder.name}")
            generate_manifest(folder)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate project gallery manifests"
    )

    parser.add_argument(
        "directory",
        help="Parent directory containing project folders"
    )

    args = parser.parse_args()

    generate_all_manifests(args.directory)


if __name__ == "__main__":
    main()