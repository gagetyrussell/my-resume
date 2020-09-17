import { Component } from 'react';
import { Layout, Icon, message } from 'antd';
import SiderMenu from "../components/SiderMenu/SiderMenu";
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import GlobalHeader from "../components/GlobalHeader";

const { Content, Header, Footer } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      isauth: false,
      currentUser: {
        name: '',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/qpwiqTwLLqaSmMKFZDYx.png',
        userid: '',
        notifycount: 1
      }
    });
  };

  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;
    return (
      <Layout>
        <SiderMenu
          logo={logo}
          collapsed={collapsed}
          menuData={getMenuData()}
          location={location}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              isauth={this.state.isauth}
              logo={logo}
              collapsed={collapsed}
              currentUser={this.state.currentUser}
              onCollapse={this.handleMenuCollapse}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            { children }
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
