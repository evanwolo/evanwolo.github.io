const projectList = document.querySelector('#project-list');
const projectStatus = document.querySelector('#project-status');
const projectCount = document.querySelector('#project-count');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderProject(project, index) {
  const row = element('details', 'project');
  row.name = 'projects';
  row.id = project.id;
  const summary = element('summary');
  const technologies = element('span', 'technologies');
  for (const technology of project.technologies) {
    const icon = element('img');
    icon.src = technology.icon;
    icon.alt = technology.name;
    icon.title = technology.name;
    technologies.append(icon);
  }
  const indicator = element('span', 'indicator', '+');
  indicator.setAttribute('aria-hidden', 'true');
  const heading = element('span', 'project-heading');
  heading.append(element('span', 'project-title', project.name));
  if (project.tags?.length) {
    const tags = element('span', 'project-tags');
    tags.setAttribute('role', 'list');
    tags.setAttribute('aria-label', 'Project tags');
    for (const tag of project.tags) {
      const label = element('span', 'project-tag', tag);
      label.setAttribute('role', 'listitem');
      tags.append(label);
    }
    heading.append(tags);
  }
  summary.append(
    element('span', 'number', String(index + 1).padStart(2, '0')),
    heading,
    technologies,
    indicator
  );
  const body = element('div', 'project-body');
  if (project.title) body.append(element('h3', 'project-full-title', project.title));
  if (project.context) body.append(element('p', 'project-context', project.context));
  body.append(element('p', '', project.description));
  if (project.methods) body.append(element('p', 'project-context', project.methods));
  if (project.overview) {
    for (const paragraph of project.overview) body.append(element('p', 'project-overview', paragraph));
  }
  if (project.metrics) {
    const metrics = element('dl', 'project-metrics');
    for (const metric of project.metrics) {
      const item = element('div');
      const label = element('dt', '', metric.label);
      label.title = metric.detail;
      item.append(label, element('dd', '', metric.value));
      metrics.append(item);
    }
    body.append(metrics);
  }
  if (project.resultsNote) body.append(element('p', 'results-note', project.resultsNote));
  if (project.visual) {
    const figure = element('figure', 'project-visual');
    const image = element('img');
    image.src = project.visual.src;
    image.alt = project.visual.alt;
    image.width = 440;
    image.height = 120;
    figure.append(image, element('figcaption', '', project.visual.caption));
    body.append(figure);
  }
  const highlights = element('ul');
  for (const highlight of project.highlights) highlights.append(element('li', '', highlight));
  body.append(highlights);
  if (project.repository) {
    const repository = element('a', 'repository-link');
    repository.href = project.repository;
    repository.setAttribute('aria-label', `View ${project.name} repository on GitHub`);
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16');
    icon.append(path);
    repository.append(icon, element('span', '', 'View repository'), element('span', 'repository-arrow', '↗'));
    repository.lastChild.setAttribute('aria-hidden', 'true');
    body.append(repository);
  }
  row.append(summary, body);
  return row;
}

async function loadProjects() {
  try {
    const response = await fetch('./projects.json');
    if (!response.ok) throw new Error(`Project request failed: ${response.status}`);
    const projects = await response.json();
    if (!Array.isArray(projects)) throw new Error('Expected a project array');
    const rows = projects.map(renderProject);
    projectList.replaceChildren(...rows);
    projectCount.textContent = String(projects.length).padStart(2, '0');
    projectStatus.hidden = projects.length > 0;
    projectStatus.textContent = projects.length ? '' : 'No projects to show yet.';
  } catch (error) {
    projectStatus.textContent = 'Projects could not be loaded. Please refresh to try again.';
    console.error(error);
  }
}

loadProjects();
