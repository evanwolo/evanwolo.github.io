$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
function Escape($value) { [System.Net.WebUtility]::HtmlEncode([string]$value) }
$projects = ConvertFrom-Json ([IO.File]::ReadAllText("$PSScriptRoot/projects.json"))
$rows = for ($i = 0; $i -lt $projects.Count; $i++) {
  $p = $projects[$i]
  if (!$p.id -or !$p.name -or !$p.description) { throw 'Projects require id, name, and description' }
  $displayName = if ($p.displayName) { $p.displayName } else { $p.name }
  $summary = if ($p.summary) { $p.summary } else { $p.description }
  $tags = foreach ($tag in $p.tags) { '<span class="project-tag">' + (Escape $tag) + '</span>' }
  $icons = foreach ($tech in $p.technologies) {
    if (!(Test-Path -LiteralPath $tech.icon)) { throw "Missing icon: $($tech.icon)" }
    '<img width="20" height="20" src="' + (Escape $tech.icon) + '" alt="' + (Escape $tech.name) + '" title="' + (Escape $tech.name) + '">'
  }
  $sections = foreach ($item in @(@('Problem', $p.problem), @('My contribution', $p.contribution), @('Result', $p.outcome))) {
    if ($item[1]) { '<div class="case-section"><h4>' + $item[0] + '</h4><p>' + (Escape $item[1]) + '</p></div>' }
  }
  $technicalItems = if ($p.technicalDetails) { $p.technicalDetails } else { $p.highlights }
  $technical = foreach ($item in $technicalItems) { '<li>' + (Escape $item) + '</li>' }
  $overview = foreach ($item in $p.overview) { '<p>' + (Escape $item) + '</p>' }
  $link = if ($p.repository) { '<a class="repository-link" href="' + (Escape $p.repository) + '" aria-label="View ' + (Escape $displayName) + ' repository on GitHub">View repository <span aria-hidden="true">&#8599;</span></a>' }
  $note = if ($p.resultsNote) { '<p class="results-note">' + (Escape $p.resultsNote) + '</p>' }
  $tools = if ($p.methods) { $p.methods } else { ($p.technologies.name -join ' / ') }
  @"
<details class="project" name="projects" id="$(Escape $p.id)">
  <summary><span class="number">$('{0:D2}' -f ($i + 1))</span><span class="project-heading"><span class="project-title">$(Escape $displayName)</span><span class="project-summary">$(Escape $summary)</span><span class="project-tags">$($tags -join '')</span></span><span class="technologies">$($icons -join '')</span><span class="indicator" aria-hidden="true">+</span></summary>
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
$posts = @(ConvertFrom-Json ([IO.File]::ReadAllText("$PSScriptRoot/posts.json")) | ForEach-Object { $_ })
$posts = @($posts | Sort-Object date -Descending)
$postRows = for ($i = 0; $i -lt $posts.Count; $i++) {
  $post = $posts[$i]
  if (!$post.id -or !$post.title -or !$post.date -or !$post.paragraphs.Count) { throw 'Posts require id, title, date, and paragraphs' }
  $date = [datetime]::ParseExact($post.date, 'yyyy-MM-dd', [cultureinfo]::InvariantCulture)
  $tags = foreach ($tag in $post.tags) { '<span class="project-tag">' + (Escape $tag) + '</span>' }
  $paragraphs = foreach ($paragraph in $post.paragraphs) { '<p>' + (Escape $paragraph) + '</p>' }
  @"
<article class="feed-entry" id="post-$(Escape $post.id)" aria-labelledby="post-title-$(Escape $post.id)">
  <time class="feed-date" datetime="$(Escape $post.date)">$($date.ToString('dd MMM yyyy', [cultureinfo]::InvariantCulture))</time>
  <div class="feed-content"><div class="project-tags">$($tags -join '')</div><h3 id="post-title-$(Escape $post.id)">$(Escape $post.title)</h3><p class="feed-summary">$(Escape $post.summary)</p><details class="feed-details"><summary>Read entry</summary><div class="post-body">$($paragraphs -join "`n")</div></details></div>
</article>
"@
}
$postContent = if ($posts.Count) { '<div class="news-feed">' + ($postRows -join "`n") + '</div>' } else { '<div class="feed-empty"><span class="feed-marker" aria-hidden="true"></span><p>No entries yet.<span>Project notes and updates will appear here.</span></p></div>' }
$blog = '<!-- BLOG:START -->' + "`n" + '<h2 id="blog-heading" class="index-heading">Blog <span>Latest updates / ' + ('{0:D2}' -f $posts.Count) + '</span></h2>' + "`n" + $postContent + "`n<!-- BLOG:END -->"
if ($html -notmatch '(?s)<!-- BLOG:START -->.*?<!-- BLOG:END -->') { throw 'Missing blog markers' }
$html = [regex]::Replace($html, '(?s)<!-- BLOG:START -->.*?<!-- BLOG:END -->', [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $blog })
$html = [regex]::Replace($html, '[ \t]+(?=\r?$)', '', 'Multiline')
[IO.File]::WriteAllText($path, $html)
Write-Output "Rendered $($projects.Count) static project entries."
Write-Output "Rendered $($posts.Count) static blog entries."
