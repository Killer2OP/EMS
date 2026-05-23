$files = Get-ChildItem -Path "src\app" -Recurse -Filter "*.component.ts"

$replacements = [ordered]@{
    'ems-card' = 'bg-card rounded-2xl shadow-sm border border-border overflow-hidden'
    'page-header' = 'mb-6'
    'form-row' = 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4'
    'form-group' = 'flex flex-col gap-1.5'
    'vs-input' = 'w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted'
    'vs-select' = 'w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url(''data:image/svg+xml,%3Csvg_xmlns=\''http://www.w3.org/2000/svg\''_width=\''12\''_height=\''12\''_viewBox=\''0_0_12_12\''%3E%3Cpath_d=\''M2_4l4_4_4-4\''_stroke=\''%2364748B\''_stroke-width=\''1.5\''_fill=\''none\''/%3E%3C/svg%3E'')] bg-no-repeat bg-[right_12px_center]'
    'vs-textarea' = 'w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted'
    'vs-label' = 'block text-[0.78rem] font-semibold text-text-primary mb-1.5'
    'vs-error' = 'text-[0.72rem] text-red-500 mt-1'
    'quick-actions' = 'flex gap-3 flex-wrap mb-6'
    'vs-btn primary' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn secondary' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn outline' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-transparent text-[#003087] border-[1.5px] border-[#003087] hover:bg-[#003087]/5 disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn success' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-green-500 text-white border-none hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn danger' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-red-500 text-white border-none hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn warning' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-[#F5C518] text-[#1E293B] border-none hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn accent' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-[#0066CC] text-white border-none hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed'
    'vs-btn' = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all border border-border hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed'
    'bill-preview' = 'bg-card-hover border border-border rounded-xl p-6'
    'bill-row' = 'flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0'
    'total-row' = 'flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2'
    'label' = 'text-[0.82rem] text-text-secondary'
    'value' = 'text-[0.85rem] font-semibold text-text-primary'
    'success-screen' = 'text-center py-12 px-4'
    'success-icon' = 'w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-[0_0_0_12px_rgba(34,197,94,0.1)] animate-[bounceIn_0.5s_ease-out]'
    'skeleton' = 'bg-[linear-gradient(90deg,var(--skeleton-from)_25%,var(--skeleton-to)_50%,var(--skeleton-from)_75%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-lg'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    foreach ($key in $replacements.Keys) {
        $content = [regex]::Replace($content, "\b$key\b", $replacements[$key])
    }
    
    # Nested replacements for page-header and bill-preview
    $content = [regex]::Replace($content, '<div class="mb-6">\s*<h1>(.*?)</h1>\s*<p>(.*?)</p>\s*</div>', '<div class="mb-6">`n<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">$1</h1>`n<p class="m-0 text-[0.82rem] text-text-secondary">$2</p>`n</div>')
    
    $content = [regex]::Replace($content, '<div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2">\s*<div class="text-\[0.82rem\] text-text-secondary">(.*?)</div>\s*<div class="text-\[0.85rem\] font-semibold text-text-primary">(.*?)</div>\s*</div>', '<div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2">`n<div class="text-[0.9rem] font-bold text-text-primary">$1</div>`n<div class="text-[1.1rem] font-extrabold text-[#003087] dark:text-blue-400">$2</div>`n</div>')

    $content = [regex]::Replace($content, '<div class="text-center py-12 px-4">\s*<div class="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-\[0_0_0_12px_rgba\(34,197,94,0.1\)\] animate-\[bounceIn_0.5s_ease-out\]">(.*?)</div>\s*<h2>(.*?)</h2>\s*<p>(.*?)</p>\s*</div>', '<div class="text-center py-12 px-4">`n<div class="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-[0_0_0_12px_rgba(34,197,94,0.1)] animate-[bounceIn_0.5s_ease-out]">$1</div>`n<h2 class="text-[1.4rem] font-bold text-[#003087] dark:text-blue-400 m-0 mb-2">$2</h2>`n<p class="text-text-secondary text-[0.85rem]">$3</p>`n</div>')

    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated $($file.Name)"
    }
}
