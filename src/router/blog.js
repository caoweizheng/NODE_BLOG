const { getList, getDetail, createBlog, editBlog, deleteBlog } = require('../dataController/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const serverBlogHandle = (req, res) => {
  const id = req.query.id

  // 获取博客列表
  if(req.method === 'GET' && req.path === '/app/blog/list') {
    console.log(req.session)

    const author = req.session.username || ''
    const keyWrod = req.query.title || ''
    const resultPromise = getList(author, keyWrod)
    return resultPromise.then(listDate => {
      return new SuccessModel(listDate)
    })
  }

  // 根据 id 获取博客详情
  if(req.method === 'GET' && req.path === '/app/blog/detail') {
    if(!id)  return new ErrorModel('缺少必要参数： id')

    const detailPromise = getDetail(id)
    return detailPromise.then(res => {
      return new SuccessModel(res)
    })
  }

  // 新建博客
  if(req.method === 'POST' && req.path === '/app/blog/create') {
    const createPromise = createBlog({...req.body, author: req.session.username})
    return createPromise.then(createResult => {
      if(!createResult) return new ErrorModel('新建博客失败')
      return new SuccessModel(createResult)
    })
  }

  // 编辑博客
  if (req.method === 'POST' && req.path === '/app/blog/edit') {
    const editPromise = editBlog(id, req.body)
    return editPromise.then(editResult => {
      console.log(editResult)
      if(!editResult) return new ErrorModel('编辑博客失败')
      return new SuccessModel(editResult)
    })
  }

  // 删除微博 
  if(req.method === 'POST' && req.path === '/app/blog/delete') {
    const author = req.body.author
    const delPromise = deleteBlog(id, author)
    return delPromise.then(delResult => {
      if(!delResult) return new ErrorModel('删除微博失败') 
      return new SuccessModel(delResult)
    })
  }

  return 
}

module.exports = serverBlogHandle