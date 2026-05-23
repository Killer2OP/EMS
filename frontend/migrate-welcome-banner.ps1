$files = @(
    "src\app\admin\dashboard\admin-dashboard.component.ts",
    "src\app\customer\home\home.component.ts",
    "src\app\sme\dashboard\sme-dashboard.component.ts"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # sme dashboard has inline style for welcome-banner
    $content = $content.Replace('<div class="welcome-banner" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #334155 100%);">', '<div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl p-8 text-white mb-6 relative overflow-hidden after:content-[''⚡''] after:absolute after:right-8 after:top-1/2 after:-translate-y-1/2 after:text-[5rem] after:opacity-10">')
    
    $content = $content.Replace('<div class="welcome-banner">', '<div class="bg-gradient-to-br from-[#003087] via-[#0066CC] to-[#0078D4] rounded-2xl p-8 text-white mb-6 relative overflow-hidden after:content-[''⚡''] after:absolute after:right-8 after:top-1/2 after:-translate-y-1/2 after:text-[5rem] after:opacity-10">')
    
    $content = [regex]::Replace($content, '<h2(.*?)>(.*?)</h2>', '<h2$1 class="m-0 mb-1 text-[1.5rem] font-bold">$2</h2>')
    
    # We might accidentally replace <p> tags elsewhere, so let's only replace `<p>` inside welcome banner if possible, 
    # but the simplest is just to add a quick regex for p immediately following h2
    $content = [regex]::Replace($content, '</h2>\s*<p>', '</h2>`n<p class="m-0 mb-4 text-white/70 text-[0.85rem]">')

    $content = $content.Replace('class="meter-info"', 'class="inline-flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-full text-[0.78rem] font-medium backdrop-blur-sm"')
    
    Set-Content -Path $file -Value $content
}
