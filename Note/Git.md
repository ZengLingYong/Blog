### config 作用域
```shell
// 配置：缺省等同于 local
git config --local  // 只对某个仓库生效
git config --global // 对当前用户所有仓库生效
git config --system // 对系统所有登陆的用户生效

// 显示配置 --list
git config --list

// 设置用户名
git config --global user.name 'KenTsang'

```

| 命令 | 作用 |
| -- | -- |
| git init [FolderName] | 无 FolderName 会初始化当前文件夹，有 FolderName 会创建新文件夹并初始化项目 |
| git add -u| 会把已经被git跟踪的文件的修改添加到暂存区域 |
| git mv [oldFileName] [newFileName] | 重命名且提交至暂存区 |
| git checkout -b branchName commitCode | 基于哪个更新版本创建分支 |
| git checkout | 以暂存区为基础恢复工作区 |
| git reset | 以HEAD为基础恢复暂存取 |
| git reset --hard | 同时恢复暂存区/工作区（慎用），会删除掉一些commit |
| git rm | 删除文件且提交至暂存区 |
| git stash ||

### 标签

```shell
// 附注标签
git tag -a [TagName] -m "[Remark]"

// 删除标签
git tag -d [TagName]
// 删除远程标签
git push origin :refs/tags/[TagName]

// 查看标签
git tag -l								// 所有
git tag -l "*customer*" 	// 筛选

// 推送标签
git push origin [TagName]

// 查看该标签所有commit
git log --pretty=oneline [TagName]

// vantop 打标签模版
git tag -a test-tag-customer-service-v1.1-20201224 -m "[Remark]"
```

### 分支

```shell
// 本地重命名
git branch -m [OldBranchName] [NewBranchName]

// 删除远程分支
git push --delete origin [BranchName]

// 
```

