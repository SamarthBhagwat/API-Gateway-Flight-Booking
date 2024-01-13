class BasicCRUDRepository{
    constructor(model){
        this.model = model;
    }

    async create(data){
        const response = await this.model.create(data);
        return response;
    }

    async findAll(){
        const response = await this.model.findAll();
        return response;
    }

    async findByPk(id){
        const response = await this.model.findByPk(id);
        return response;
    }

    async update(id, updateData){
        const response = await this.model.update(updateData, {
            where:{
                id:id
            }
        });
        return response;
    }

    async destroy(id){
        const response = await this.model.destroy({
            where:{
                id : id
            }
        });
        return response;
    }
}

module.exports = BasicCRUDRepository;