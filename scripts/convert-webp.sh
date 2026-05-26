#!/usr/bin/env bash
# 从 public/_img_originals 重新转换为 WebP，写入 public/images（覆盖）。
# 策略：照片有损（视觉无损），真正带透明的图形保真；有损产物保证不大于原图。
set -u
SRC="_img_originals"
DST="public/images"
ok=0; relossy=0; magickn=0

while IFS= read -r orig; do
  rel="${orig#"$SRC"/}"
  out="$DST/${rel%.*}.webp"
  mkdir -p "$(dirname "$out")"
  ext=$(echo "${orig##*.}" | tr 'A-Z' 'a-z')
  realfmt=$(magick identify -format '%m' "$orig" 2>/dev/null | head -1)
  lossy=1   # 默认有损（可触发体积兜底）

  if [ "$realfmt" = "AVIF" ] || [ "$realfmt" = "HEIC" ]; then
    # cwebp 读不了 AVIF/HEIC，用 magick 转（质量 82）。cwebp 无法重压这类源，
    # 故置 lossy=0 跳过体积兜底，避免对解不了的源做无意义的 cwebp 重试。
    magick "$orig" -quality 82 "$out" 2>/dev/null; magickn=$((magickn+1)); lossy=0
  elif [ "$ext" = "png" ]; then
    opaque=$(magick identify -format '%[opaque]' "$orig" 2>/dev/null | head -1)
    sz=$(stat -f%z "$orig")
    if [ "$opaque" = "False" ] && [ "$sz" -lt 600000 ]; then
      cwebp -quiet -lossless -z 9 "$orig" -o "$out"; lossy=0   # 小图形带透明：无损保真
    elif [ "$opaque" = "False" ]; then
      cwebp -quiet -q 90 -alpha_q 100 -m 6 "$orig" -o "$out"   # 大图带透明：有损+保真透明
    else
      cwebp -quiet -q 84 -m 6 "$orig" -o "$out"                # 不透明 PNG＝照片：有损
    fi
  else
    cwebp -quiet -q 80 -m 6 "$orig" -o "$out"                  # JPEG 照片：有损
  fi

  [ -f "$out" ] || { echo "❌ 失败: $orig"; continue; }
  ok=$((ok+1))

  # 兜底：有损产物若仍不小于原图，逐级降质，确保压缩
  if [ "$lossy" = "1" ]; then
    os=$(stat -f%z "$orig"); ws=$(stat -f%z "$out")
    if [ "$ws" -ge "$os" ]; then
      for q in 72 60; do
        cwebp -quiet -q $q -m 6 "$orig" -o "$out" 2>/dev/null
        ws=$(stat -f%z "$out"); [ "$ws" -lt "$os" ] && break
      done
      relossy=$((relossy+1))
    fi
  fi
done < <(find "$SRC" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \))

echo "✅ 重转换完成: $ok 张（$relossy 张触发体积兜底, $magickn 张用 magick 转）"
echo "public/images 现体积: $(du -sh "$DST" | cut -f1)"
