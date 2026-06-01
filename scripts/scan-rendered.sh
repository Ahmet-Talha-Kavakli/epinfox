#!/bin/bash
# Tüm route'ları EN locale ile çekip render'da kalan görünür TR-karakterli metni sayar.
BASE="http://localhost:3000"
ROUTES=(
  / /about /account /account/api /account/billing /account/donations
  /account/player-ids /account/reseller /account/security /account/settings
  /account/social /api-docs /cart /contact /distance-sales /earn /help
  /invoices /messages /news /notifications /orders /privacy /publisher
  /publisher/apply /raffles /referral /refund /reseller /reseller/apply
  /store /support /support-us /terms /wallet /wallet/transactions
)
mkdir -p /tmp/scan_en
for r in "${ROUTES[@]}"; do
  fn=$(echo "$r" | sed 's|/|_|g'); [ "$fn" = "_" ] && fn="_home"
  code=$(curl -s -H "Cookie: locale=en" "$BASE$r" -o "/tmp/scan_en/$fn.html" -w "%{http_code}")
  cnt=$(grep -oE '>[^<>]*[çğıöşüÇĞİÖŞÜ][^<>]*<' "/tmp/scan_en/$fn.html" 2>/dev/null | grep -vE '^>[[:space:]]*<' | wc -l | tr -d ' ')
  printf "%-24s HTTP %s  TRtext:%s\n" "$r" "$code" "$cnt"
done
