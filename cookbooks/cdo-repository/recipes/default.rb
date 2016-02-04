#
# Cookbook Name:: cdo-repository
# Recipe:: default
#

# Sync repo via SSH if key is provided.
include_recipe 'cdo-github-access'
has_ssh_key = node['cdo-github-access'] && node['cdo-github-access']['id_rsa'] != ''
if has_ssh_key
  node.override['cdo-repository']['url'] = 'git@github.com:code-dot-org/code-dot-org.git'
end

home_path = node[:home]
git_path = File.join home_path, node.chef_environment

git git_path do
  repository node['cdo-repository']['url']
  depth node['cdo-repository']['depth'] if node['cdo-repository']['depth']

  # Checkout at clone time using --branch [checkout_branch] to skip additional checkout step.
  enable_checkout false

  branch = node['cdo-repository']['branch']
  checkout_branch branch
  revision branch

  # Skip git-repo sync when using a shared volume.
  action GitHelper.shared_volume?(git_path, home_path) ? :nothing : :sync

  user node[:user]
  group node[:user]
end
