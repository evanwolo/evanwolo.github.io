$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
function Escape($value) { [System.Net.WebUtility]::HtmlEncode([string]$value) }
$projects = ConvertFrom-Json ([IO.File]::ReadAllText("$PSScriptRoot/projects.json"))
$rows = for ($i = 0; $i -lt $projects.Count; $i++) {
  $p = $projects[$i]
  $tags = foreach ($tag in $p.tags) { '<span class="project-tag">' + (Escape $tag) + '</span>' }
  $icons = foreach ($tech in $p.technologies) {
    if (!(Test-Path -LiteralPath $tech.icon)) { throw "Missing icon: $($tech.icon)" }
    '<img width="20" height="20" src="' + (Escape $tech.icon) + '" alt="' + (Escape $tech.name) + '" title="' + (Escape $tech.name) + '">'
  }
  $sections = foreach ($item in @(@('Problem', $p.problem), @('My contribution', $p.contribution), @('Result', $p.outcome))) {
    '<div class="case-section"><h4>' + $item[0] + '</h4><p>' + (Escape $item[1]) + '</p></div>'
  }
  $technical = foreach ($item in $p.technicalDetails) { '<li>' + (Escape $item) + '</li>' }
  $overview = foreach ($item in $p.overview) { '<p>' + (Escape $item) + '</p>' }
  $link = if ($p.repository) { '<a class="repository-link" href="' + (Escape $p.repository) + '" aria-label="View ' + (Escape $p.displayName) + ' repository on GitHub">View repository <span aria-hidden="true">&#8599;</span></a>' }
  $note = if ($p.resultsNote) { '<p class="results-note">' + (Escape $p.resultsNote) + '</p>' }
  $tools = if ($p.methods) { $p.methods } else { ($p.technologies.name -join ' / ') }
  @"
<details class="project" name="projects" id="$(Escape $p.id)">
  <summary><span class="number">$('{0:D2}' -f ($i + 1))</span><span class="project-heading"><span class="project-title">$(Escape $p.displayName)</span><span class="project-summary">$(Escape $p.summary)</span><span class="project-tags">$($tags -join '')</span></span><span class="technologies">$($icons -join '')</span><span class="indicator" aria-hidden="true">+</span></summary>
  <div class="project-body">
    <h3 class="project-full-title">$(Escape $p.name)</h3>
    <p class="project-context">$(Escape $p.context)</p>
    $($sections -join "`n")
    $note
    <p class="project-context"><strong>Technologies &amp; methods</strong><br>$(Escape $tools)</p>
    <details class="technical-details"><summary>Technical details</summary><div><p>$(Escape $p.description)</p>$($overview -join '')<ul>$($technical -join '')</ul></div></details>
    $link
  </div>
</details>
"@
}
$content = '<!-- PROJECTS:START -->' + "`n" + '<h2 id="projects-heading" class="index-heading">Selected projects <span>' + ('{0:D2}' -f $projects.Count) + '</span></h2>' + "`n" + ($rows -join "`n") + "`n<!-- PROJECTS:END -->"
$path = "$PSScriptRoot/index.html"
$html = [IO.File]::ReadAllText($path)
if ($html -notmatch '(?s)<!-- PROJECTS:START -->.*?<!-- PROJECTS:END -->') { throw 'Missing project markers' }
$html = [regex]::Replace($html, '(?s)<!-- PROJECTS:START -->.*?<!-- PROJECTS:END -->', [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $content })
$html = [regex]::Replace($html, '[ \t]+(?=\r?$)', '', 'Multiline')
[IO.File]::WriteAllText($path, $html)
Write-Output "Rendered $($projects.Count) static project entries."
