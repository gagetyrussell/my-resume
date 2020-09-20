/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

const menuData = [
  {
    name: 'Curriculum Vitae',
    icon: 'read',
    path: 'resume',
    children: [
      {
        name: 'Overview',
        path: 'overview',
      },
      {
        name: 'JP3, a Flotek Company',
        path: 'jp3',
      },
      {
        name: 'International Paper',
        path: 'ip',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'University of Oklahoma',
        path: 'OU',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'Blue Waters',
        path: 'BWSIP',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'Crescent Point Energy',
        path: 'cpe',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'Shell',
        path: 'shell',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'Tutoring',
        path: 'tutoring',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'Macmillan',
        path: 'macmillan',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
      {
        name: 'Nicatine, llc',
        path: 'nicatine',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: 'Tools',
    icon: 'tool',
    path: 'tools',
    children: [
      {
        name: 'Simple-Pivot-Reporter',
        path: 'pivotReporter',
      },
      {
        name: 'Managed-Pivot-Reporter',
        path: 'viewer',
      },
    ],
  },
  {
    name: 'Application Downloads',
    icon: 'download',
    path: 'downloads',
    children: [
      {
        name: 'Pivot-Reporter',
        path: 'pivotReporter',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
