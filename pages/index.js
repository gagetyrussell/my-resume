import Link from 'umi/link';

export default () =>
  <>
    <h1>Index Page</h1>
    <h2>Pages</h2>
    <ul>
      <li><h3>Curriculum Vitae</h3></li>
      <ul>
        <li><Link to="/resume/overview">/resume/overview</Link></li>
      </ul>
      <li><h3>Tools</h3></li>
      <ul>
        <li><Link to="/tools/pivotReporter">/tools/pivotReporter</Link></li>
      </ul>
    </ul>
  </>
