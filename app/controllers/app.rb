Vocabulist.controllers :app do

  get :index, :map=>"/", :provides=>:html do
    render "app/index"
  end

  get :synonym, :map=>"/synonym/:words", :provides=>[:json] do
    words = params[:words].split("+")
    (words[1..-1].reduce(Vocabulist.thesaurus[words[0].downcase] || []){|a,b| a & (Vocabulist.thesaurus[b.downcase] || [])} || []).sort.to_json
  end

  get :synonym, :map=>"/synonym", :provides=>[:json] do
    [].to_json
  end
  
end
