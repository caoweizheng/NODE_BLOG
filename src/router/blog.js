const { getList, getDetail, createBlog } = require('../dataController/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const serverBlogHandle = (req, res) => {
  const id = req.query.id

  // 获取博客列表
  if(req.method === 'GET' && req.path === '/app/blog/list') {

    const author = req.query.author || ''
    const keyWrod = req.query.keyWrod || ''
    const resultPromise = getList(author, keyWrod)
    return resultPromise.then(listDate => {
      return new SuccessModel(listDate)
    })
  }

  // 根据 id 获取博客详情
  if(req.method === 'GET' && req.path === '/app/blog/detail') {
    if(!id)  return new ErrorModel('缺少必要参数： id')

    const detail = getDetail(id)
    return new SuccessModel(detail)
  }

  // 新建博客
  if(req.method === 'POST' && req.path === '/app/blog/create') {
    const createResult = createBlog(req.body)
    if(!createResult) return new ErrorModel('新建博客失败')
    return new SuccessModel(createResult)
  }

  // 编辑博客
  if (req.method === 'POST' && req.path === '/app/blog/edit') {
    const editResult = editBlog(id, req.body)
    if(!editResult) return new ErrorModel('编辑博客失败')
    return new SuccessModel(editResult)
  }

  return 
}

module.exports = serverBlogHandle