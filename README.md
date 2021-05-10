serdarkuzucu.com
==

# What is this repository about?

This is both the source code and deployment repository of my personal blog 
[serdarkuzucu.com](https://serdarkuzucu.com).

My blog is developed using [jekyll](https://jekyllrb.com/).
Jekyll is a static site generator. 
It takes text written in your favorite markup language and uses layouts to create a static website. 
You can tweak the site’s look and feel, URLs, the data displayed on the page, and more.

In this repository, I keep jekyll source code, build scripts, and blog posts in Markdown format.

# How it works?

[Travis-ci](https://www.travis-ci.com/) is used as a continuous delivery process. 
Everytime I push a commit to the master branch of this repo,
travis-ci builds the project 
and pushes the generated static site to 
[gh-pages](https://github.com/sedran/serdarkuzucu.com/tree/gh-pages)
branch.

There is no external web server or application server that runs my blog.
Once the static site is pushed go github, it is done, it's deployed.
[Github pages](https://pages.github.com/) is perfectly enough for free static site hosting.

# Local Development

To run & test this site locally, 
jekyll and necessary ruby dependencies should be installed on the computer.

Since I use Macbook as my development environment,
I've documented Macbook installation guide here.
Documentation for other operating systems can be found on [official jekyll site.](https://jekyllrb.com/docs/installation/)

## Install Command Line Tools

```shell
xcode-select --install
```

## Install Ruby

Jekyll requires Ruby v2.4.0 or higher. 
macOS Big Sur 11.x ships with Ruby 2.6.3. 
Check your Ruby version using `ruby -v`.

If you’re running a previous version of macOS, 
you’ll have to install a newer version of Ruby.

```shell
brew install ruby
```

Add the brew ruby and gems path to your shell configuration:

```shell
echo 'export PATH="/usr/local/opt/ruby/bin:/usr/local/lib/ruby/gems/3.0.0/bin:$PATH"' >> ~/.zshrc
```


## Install Jekyll

```shell
gem install --user-install bundler jekyll
```

Append your path file with the following, 
replacing the X.X with the first two digits of your Ruby version:

```shell
echo 'export PATH="$HOME/.local/share/gem/ruby/X.X.0/bin:$PATH"' >> ~/.zshrc
```

## Bundle Install

Invoke `bundle install` in project directory.
If it fails because of dependency versions, invoke `bundle update`.


## Start Development Server

I created a simple sh script in order to prevent myself memorizing the startup command.

```shell
cd path-to-project-directory
./start-dev.sh
```

This command starts jekyll live development server.
The static site is generated and served under [localhost:4000](http://127.0.0.1:4000/).
Everytime a post is added or modified, 
the live development server rebuilds modified files.
No restart is necessary. Just reload the page in the browser.


