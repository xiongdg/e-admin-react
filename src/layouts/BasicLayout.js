import React, { Component } from 'react'
import { Layout } from 'antd'
import { renderRoutes, matchRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import styles from './BasicLayout.module.less'
import HeaderBar from './HeaderBar'
import Bread from './Bread'
import Sidebar from './Sidebar'
import PageLoading from '@/components/page-loading'
import { clearPending } from '@/utils/request'
const { Content, Footer } = Layout

@connect(({ app }) => ({ app }))
class BasicLayout extends Component {
  state = {
    collapsed: false,
    pathname: ''
  }
  componentDidMount() {
    NProgress.done()
    // this.setDocumentTitle(this.props)
    // this.props.history.listen(route => {
    //   console.log(route)
    //   NProgress.start()
    // })
  }
  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.pathname) {
      NProgress.start()
      clearPending()
      return {
        pathname: props.location.pathname
      }
    }
    return null
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // const el = document.getElementById('main')
      // scrollTo(el, el.scrollTop, 0, 0)
    }
    // this.setDocumentTitle(nextProps)
    NProgress.done()
  }
  componentWillUnmount() {
    NProgress.done()
  }
  // setDocumentTitle = (props) => {
  //   routes.forEach(route => {
  //     if (route.path === props.location.pathname) {
  //       document.title = route.title || 'e-admin'
  //     }
  //   })
  // }
  handleToggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  render() {
    const { collapsed } = this.state
    const mainClass = classNames({
      [styles.mainContainer]: true,
      [styles.unfold]: collapsed
    })
    const { app, location, route, dispatch, history } = this.props
    const { menus, user, breads, pageLoading } = app
    const headerProps = {
      collapsed,
      onToggle: this.handleToggle,
      dispatch,
      history,
      user
    }
    const breadProps = {
      breads
    }
    const sidebarProps = {
      collapsed,
      menus,
      location
    }
    const branch = matchRoutes(route.routes, location.pathname)
    // 只要匹配到 * 或者 /404 路径的，就为 Not Found
    const isNotFound = branch.some(item => item.route.path === '*' || item.route.path === '/404')
    const contentStyle = {
      paddingTop: isNotFound ? 24 : 0
    }
    return (
      <div className={styles.appContainer}>
        <Sidebar {...sidebarProps} />
        <Layout className={mainClass}>
          <HeaderBar {...headerProps} />
          <Content className={styles.content} style={contentStyle}>
            {!isNotFound && <Bread {...breadProps} />}
            <div className={styles.contentInner}>
              {renderRoutes(route.routes)}
            </div>
          </Content>
          <Footer className={styles.footer}>正在缓冲99% ©2019 Created by platchar</Footer>
        </Layout>
        <PageLoading spinning={pageLoading} />
      </div>
    )
  }
}

export default BasicLayout
